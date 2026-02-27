import { z } from "zod";
import { RaynaApiService } from "../rayna-api.service";
import { TourCardService } from "../services/tour-card.service";

export const getTourCardsSchema = {
  name: "get_tour_cards",
  description: "Get tours in card format for display in carousel. Use this when users ask for tour recommendations, popular tours, or want to browse activities.",
  input_schema: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "Filter by city (Dubai, Abu Dhabi, Singapore, Bangkok, etc.)",
      },
      category: {
        type: "string", 
        description: "Filter by category (desert safari, city tour, theme park, water park, adventure, cruise, cultural)",
      },
      carouselType: {
        type: "string",
        enum: ["featured", "discount", "location", "category", "all"],
        description: "Type of carousel to create - featured (popular tours), discount (special offers), location (city-specific), category (activity type), or all (general recommendations)",
        default: "featured"
      },
      limit: {
        type: "number",
        description: "Maximum number of tour cards to return (default 6, max 12)",
        default: 6,
      },
    },
    required: [],
    additionalProperties: false,
  },
};

const inputSchema = z.object({
  city: z.string().optional(),
  category: z.string().optional(), 
  carouselType: z.enum(["featured", "discount", "location", "category", "all"]).default("featured"),
  limit: z.number().min(1).max(12).default(6),
});

export async function getTourCards(input: unknown) {
  try {
    const { city, category, carouselType, limit } = inputSchema.parse(input);
    const raynaApi = new RaynaApiService();

    console.log(`[getTourCards] Fetching ${carouselType} tours for ${city || 'all cities'}, category: ${category || 'all'}, limit: ${limit}`);

    // Get tours based on filters
    let tours: any[] = [];

    if (city && city.toLowerCase() !== 'all') {
      // First get available cities to find the cityId
      const citiesResult = await raynaApi.execute('get_available_cities', { productType: 'tour' });
      const citiesData = JSON.parse(citiesResult);
      
      if (citiesData.success && citiesData.data) {
        // API shape: { data: { data: { options: [ { countryName, cities: [ {id, name} ] } ] } } }
        const options = citiesData.data?.data?.data?.options || [];
        const allCities = options.flatMap((o: any) => o.cities || []);
        // Find the city ID by name
        const cityData = allCities.find((c: any) => 
          c.name?.toLowerCase() === city.toLowerCase()
        );
        
        if (cityData) {
          // Get city-specific tours using city/products (richer data)
          const cityResult = await raynaApi.execute('get_city_products', { 
            cityId: cityData.id
          });
          const cityResultData = JSON.parse(cityResult);
          const payload = cityResultData?.data || {};
          const products = payload?.data?.data?.products || [];
          tours = Array.isArray(products) ? products : [];
          // Attach city for display
          tours = tours.map((p: any) => ({ ...p, city }));
        }
      }
    } else {
      // Default to a popular city (Dubai) to ensure results
      const citiesResult = await raynaApi.execute('get_available_cities', { productType: 'tour' });
      const citiesData = JSON.parse(citiesResult);
      const options = citiesData?.data?.data?.data?.options || [];
      const allCities = options.flatMap((o: any) => o.cities || []);
      const dubai = allCities.find((c: any) => c.name?.toLowerCase() === 'dubai');
      const defaultCityId = dubai?.id || allCities[0]?.id;

      if (defaultCityId) {
        const cityResult = await raynaApi.execute('get_city_products', { cityId: defaultCityId });
        const cityResultData = JSON.parse(cityResult);
        const payload = cityResultData?.data || {};
        const products = payload?.data?.data?.products || [];
        tours = Array.isArray(products) ? products : [];
      } else {
        tours = [];
      }
    }

    if (!Array.isArray(tours)) {
      tours = [];
    }

    // Apply category filter if specified
    if (category && category.toLowerCase() !== 'all') {
      const cat = category.toLowerCase();
      tours = tours.filter((tour: any) => {
        const tourCategory = TourCardService['categorizeActivity'](tour.name || tour.title || '');
        const byName = (tour.name || tour.title || '').toLowerCase().includes(cat);
        const byFlatCategory = (tour.category || '').toLowerCase().includes(cat);
        const byArrayCategory = Array.isArray(tour.categories) && tour.categories.some((c: any) => (c.label || '').toLowerCase().includes(cat));
        return byName || byFlatCategory || byArrayCategory || tourCategory.toLowerCase().includes(cat);
      });
    }

    // Limit results
    tours = tours.slice(0, limit);

    if (tours.length === 0) {
      return JSON.stringify({
        success: false,
        message: `No tours found${city ? ` in ${city}` : ''}${category ? ` for ${category}` : ''}`,
        data: null
      });
    }

    // Create appropriate carousel based on type
    let carousel;
    
    if (city && tours.length > 0) {
      // Already city-filtered — format directly with nicer titles
      const niceTitle = carouselType === 'featured' ? `⭐ Featured in ${city}` : `🏙️ Best in ${city}`;
      const niceSubtitle = carouselType === 'discount' ? 'Limited time deals' : `Top-rated activities and tours in ${city}`;
      carousel = TourCardService.formatTourCards(tours, niceTitle, niceSubtitle);
    } else {
      switch (carouselType) {
        case 'featured':
          carousel = TourCardService.createFeaturedCarousel(tours);
          break;
        case 'discount':
          carousel = TourCardService.createDiscountCarousel(tours);
          break;
        case 'location':
          carousel = TourCardService.createLocationCarousel(tours, city || 'UAE');
          break;
        case 'category':
          carousel = TourCardService.createCategoryCarousel(tours, category || 'Adventure');
          break;
        default:
          carousel = TourCardService.formatTourCards(tours, "🌟 Recommended Tours", "Popular tours and activities");
      }
    }

    // Add helpful response text
    let responseText = `Here are some amazing ${category || 'tour'} options${city ? ` in ${city}` : ''}:\n\n`;
    
    if (carousel.cards.length > 0) {
      responseText += `✨ **${carousel.title}**\n`;
      if (carousel.subtitle) {
        responseText += `${carousel.subtitle}\n\n`;
      }

      // Add summary of what's available
      const priceRange = carousel.cards.length > 1 ? 
        `AED ${Math.min(...carousel.cards.map(c => c.currentPrice))} - AED ${Math.max(...carousel.cards.map(c => c.currentPrice))}` :
        `AED ${carousel.cards[0].currentPrice}`;

      responseText += `💰 Price range: ${priceRange}\n`;
      responseText += `📍 Locations: ${[...new Set(carousel.cards.map(c => c.location))].join(', ')}\n`;
      
      const discountCount = carousel.cards.filter(c => c.discount).length;
      if (discountCount > 0) {
        responseText += `🎯 ${discountCount} tours with special discounts!\n`;
      }

      responseText += `\n🎠 Swipe through the carousel below to explore these amazing experiences!`;
    }

    return JSON.stringify({
      success: true,
      message: responseText,
      data: {
        carousel,
        totalResults: tours.length,
        filters: {
          city: city || 'all',
          category: category || 'all',
          carouselType
        }
      }
    });

  } catch (error) {
    console.error('[getTourCards] Error:', error);
    return JSON.stringify({
      success: false,
      message: "I'm having trouble loading the tours right now. Please try again or visit raynatours.com to browse our latest offers.",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}