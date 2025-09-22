export const generateBusinessName = (userInput: string): string => {
  const input = userInput.toLowerCase().trim();
  
  // Remove common prefixes
  const cleanedInput = input
    .replace(/^(i want to build|i want to create|i want to make|build|create|make)\s+/i, '')
    .replace(/^(a|an|the)\s+/i, '');
  
  // Split into words and capitalize
  const words = cleanedInput.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0) return "Your Business";
  
  // If it's already a proper business name, return it
  if (words.some(word => word.includes('app') || word.includes('platform') || word.includes('service'))) {
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  // Generate a business name based on the concept
  const businessTypes = [
    'App', 'Platform', 'Hub', 'Pro', 'Express', 'Connect', 'Plus', 'Central'
  ];
  
  const mainConcept = words.slice(0, 2).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
  
  // Add a business suffix if the concept is short enough
  if (mainConcept.length <= 10) {
    const suffix = businessTypes[Math.floor(Math.random() * businessTypes.length)];
    return `${mainConcept}${suffix}`;
  }
  
  // Otherwise, just capitalize the words
  return words.slice(0, 3).map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};
