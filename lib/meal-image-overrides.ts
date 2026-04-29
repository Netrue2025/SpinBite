const legacyImageFixes: Record<string, { legacyUrl: string; replacementUrl: string }> = {
  "nigeria-akara-pap": {
    legacyUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Akara%20na%20Akamu%20%28Fried%20Bean%20cakes%20and%20Pap%29.jpg"
  },
  "nigeria-yam-egg": {
    legacyUrl: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Boiled%20yam%20and%20egg%20sauce.jpg"
  },
  "nigeria-moi-moi": {
    legacyUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Making%20of%20Moi-moi%201.jpg"
  },
  "nigeria-jollof": {
    legacyUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Jollof%20%28Jollof-%20Rice%29.jpg"
  },
  "uk-porridge": {
    legacyUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Porridge%20with%20berries.JPG"
  },
  "uk-beans-toast": {
    legacyUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Beans%20on%20toast.jpg"
  },
  "uk-jacket-potato": {
    legacyUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80",
    replacementUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Baked%20potato%20with%20tuna%2C%20sweetcorn%20and%20mayonnaise%20-%20Waitrose%20caf%C3%A9%2C%20Worthing%202025-12-11.jpg"
  },
  "brazil-acai": {
    legacyUrl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Acai%20bowl%20%2843110767814%29.jpg"
  },
  "brazil-pao-queijo": {
    legacyUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Pao%20de%20queijo%20%284813929850%29.jpg"
  },
  "brazil-feijoada-lite": {
    legacyUrl: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Feijoada%20%284808711154%29.jpg"
  },
  "brazil-tapioca-crepe": {
    legacyUrl: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Tapioca%20com%20queijo%20coalho%209354%20orig.jpg"
  },
  "india-poha": {
    legacyUrl: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Flattened%20Rice%20%28Poha%29%20%2849684434042%29.jpg"
  },
  "india-masala-omelette": {
    legacyUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Masala%20Omelette.jpg"
  },
  "ghana-hausa-koko": {
    legacyUrl: "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Hausa%20Kooko%20and%20Koose.jpg"
  },
  "ghana-waakye": {
    legacyUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Waakye%2C%20a%20delicious%20delicacy%20in%20Ghana.jpg"
  },
  "other-shakshuka": {
    legacyUrl: "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Shakshuka%20%28Unsplash%29.jpg"
  },
  "other-greek-yogurt": {
    legacyUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fruit%2C%20yogurt%2C%20granola%20%2833887713066%29.jpg"
  },
  "other-veggie-noodles": {
    legacyUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Vegetable%20Noodles.jpg"
  },
  "us-turkey-wrap": {
    legacyUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80",
    replacementUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/CookbookTurkeyWrap.jpg"
  }
};

export function resolveMealImageUrl(id: string, imageUrl: string) {
  const fix = legacyImageFixes[id];

  if (!fix || imageUrl !== fix.legacyUrl) {
    return imageUrl;
  }

  return fix.replacementUrl;
}

export const correctedMealImageUrls = Object.fromEntries(
  Object.entries(legacyImageFixes).map(([id, fix]) => [id, fix.replacementUrl])
) as Record<string, string>;
