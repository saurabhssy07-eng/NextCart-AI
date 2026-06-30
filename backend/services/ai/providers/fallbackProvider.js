class FallbackProvider {
  async generateInsights(context) {
    const { product, reviews, relatedProducts } = context;
    
    // Summary builder
    const summary = `${product.name} by ${product.brand} is a premium ${product.category}. ${product.description ? product.description.split('.').slice(0, 2).join('.') + '.' : 'A high-quality product designed for daily use.'}`;

    // Pros & Cons
    const pros = reviews.topPositive && reviews.topPositive.length > 0 && reviews.topPositive[0] !== 'No major positive feedback logged.'
      ? reviews.topPositive.slice(0, 3)
      : ['Excellent quality and reliability as noted by buyers.', 'Premium specifications for its price point.'];
      
    const cons = reviews.topNegative && reviews.topNegative.length > 0 && reviews.topNegative[0] !== 'No major negative feedback logged.'
      ? reviews.topNegative.slice(0, 2)
      : ['No recurring negative issues reported by customers.'];

    // Best For
    let bestFor = 'Ideal for general users looking for a reliable, feature-packed option in this category.';
    const desc = (product.description || '').toLowerCase();
    const specs = JSON.stringify(product.specifications || {}).toLowerCase();
    
    if (desc.includes('game') || desc.includes('gaming') || specs.includes('rtx') || specs.includes('gpu')) {
      bestFor = 'Best for gamers and content creators seeking high graphical and computing performance.';
    } else if (desc.includes('run') || desc.includes('sport') || desc.includes('athle')) {
      bestFor = 'Best for athletes and fitness enthusiasts seeking comfort and durability during active use.';
    } else if (desc.includes('code') || desc.includes('program') || desc.includes('develop')) {
      bestFor = 'Best for developers, students, and professionals needing a robust multitasking setup.';
    }

    // Alternatives (sourcing from catalog related products)
    const alternatives = relatedProducts && relatedProducts.length > 0
      ? relatedProducts.slice(0, 2).map(p => `${p.name} (by ${p.brand}) - A solid alternative priced at ₹${p.price.toLocaleString('en-IN')} with average rating of ${p.averageRating}/5.`)
      : ['No alternative products currently available in this category.'];

    return {
      summary,
      pros,
      cons,
      bestFor,
      alternatives
    };
  }

  async answerQuestion(context, question) {
    const { product, reviews } = context;
    const query = question.toLowerCase();
    
    const desc = (product.description || '').toLowerCase();
    const specs = JSON.stringify(product.specifications || {}).toLowerCase();
    
    // 1. Check for specs directly
    if (query.includes('spec') || query.includes('detail') || query.includes('feature')) {
      if (Object.keys(product.specifications).length > 0) {
        return `Specifications for ${product.name}: ` + 
          Object.entries(product.specifications)
            .slice(0, 3)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ') + '.';
      }
    }
    
    // 2. Check for gaming
    if (query.includes('game') || query.includes('gaming') || query.includes('graphics')) {
      const isGaming = desc.includes('game') || desc.includes('gaming') || specs.includes('rtx') || specs.includes('gpu') || specs.includes('graphic');
      return isGaming 
        ? `Yes, ${product.name} is designed with specifications that support gaming and graphical tasks.`
        : `Based on current details, ${product.name} is not explicitly optimized for high-end gaming.`;
    }
    
    // 3. Check for pricing/worth
    if (query.includes('price') || query.includes('worth') || query.includes('buy') || query.includes('cost')) {
      return `This product retails for ₹${product.price.toLocaleString('en-IN')}${product.discountPrice ? ` (discounted to ₹${product.discountPrice.toLocaleString('en-IN')})` : ''}. Review feedback indicates it is generally considered ${product.averageRating >= 4 ? 'a highly recommended' : 'a solid'} purchase.`;
    }

    // 4. Check for coding/programming
    if (query.includes('code') || query.includes('program') || query.includes('developer') || query.includes('office')) {
      const isGood = desc.includes('multitask') || desc.includes('perform') || desc.includes('processor') || product.category.toLowerCase().includes('electron');
      return isGood
        ? `Yes, the performance characteristics of ${product.name} make it well-suited for coding, office tasks, and multitasking.`
        : `This product is a ${product.category} and may not be directly relevant for software development or typical office computing tasks.`;
    }

    // 5. Check for comfort/use
    if (query.includes('comfort') || query.includes('soft') || query.includes('wear') || query.includes('fit')) {
      const isComfortable = desc.includes('comfort') || desc.includes('soft') || desc.includes('cushion') || reviews.commonKeywords.includes('comfort');
      return isComfortable
        ? `Customer reviews highlight that ${product.name} offers a highly comfortable and soft fit for regular use.`
        : `We don't have enough review data specifically detailing the long-term comfort profile of this product.`;
    }

    // 6. Check for battery/power
    if (query.includes('battery') || query.includes('power') || query.includes('charge')) {
      if (specs.includes('battery') || specs.includes('mah') || desc.includes('battery') || desc.includes('power')) {
        const specBattery = Object.entries(product.specifications).find(([k, v]) => k.toLowerCase().includes('battery') || k.toLowerCase().includes('mah'));
        return `The product specifies battery capabilities: ${specBattery ? `${specBattery[0]}: ${specBattery[1]}` : 'integrated power cells'}.`;
      }
    }

    // 7. General search in description
    if (product.description) {
      const sentences = product.description.split('.');
      const matchingSentence = sentences.find(s => s.toLowerCase().includes(query));
      if (matchingSentence) {
        return matchingSentence.trim() + '.';
      }
    }

    return "I don't have enough information to answer this question.";
  }

  async recommendProducts(candidates, query) {
    const rankings = candidates.map((item, idx) => {
      const reasons = [
        `Matches your interest in ${item.product.brand || 'premium brand'}.`,
        `Fitted criteria with a ${item.matchScore}% score.`
      ];
      if (item.scoreBreakdown.budget > 15) {
        reasons.unshift(`Comfortably fits within price constraints.`);
      }
      return {
        index: idx,
        matchScore: item.matchScore,
        reasons: reasons
      };
    });

    const isNoResults = candidates.length === 0;
    const suggestions = [];
    if (isNoResults) {
      suggestions.push('Try removing price/brand filters to widen search.');
    } else {
      suggestions.push('Compare match choices.');
      suggestions.push('Add products to compare list.');
    }

    const summary = isNoResults
      ? `I couldn't find matching choices in our database for: "${query}".`
      : `Here are the top matches I found in our database for "${query}".`;

    // Dynamically derive confidence based on highest pre-score candidate
    const topScore = candidates.length > 0 ? candidates[0].matchScore : 0;
    let confidence = 'low';
    if (topScore >= 95) confidence = 'high';
    else if (topScore >= 80) confidence = 'medium';
    else confidence = 'low';

    return {
      summary,
      confidence,
      rankings,
      suggestions
    };
  }
}

export default FallbackProvider;
