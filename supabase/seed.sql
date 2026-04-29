insert into public.meals
(id, name, description, country, meal_type, image_url, video_url, ingredients, cooking_steps, cooking_time, difficulty, tags)
values
('nigeria-akara-pap', 'Akara and Pap', 'Crispy bean cakes with warm corn pap.', 'Nigeria', 'breakfast', 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/HERU9eJwYvQ', array['Black-eyed beans','Onion','Pepper','Salt','Vegetable oil','Corn pap'], array['Blend peeled beans.','Whisk with seasoning.','Fry scoops until golden.','Serve with pap.'], '25 min', 'Medium', array['quick','cheap','local']),
('nigeria-yam-egg', 'Yam and Egg Sauce', 'Soft boiled yam with tomato egg sauce.', 'Nigeria', 'breakfast', 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/jXhTZfIGp_o', array['Yam','Eggs','Tomatoes','Onion','Pepper','Oil'], array['Boil yam.','Cook tomato sauce.','Stir in eggs.','Serve together.'], '30 min', 'Easy', array['quick','healthy','cheap','local']),
('nigeria-moi-moi', 'Moi Moi Cups', 'Steamed bean pudding cups.', 'Nigeria', 'lunch', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/v93s7xnY9fY', array['Beans','Red pepper','Onion','Palm oil','Seasoning','Egg'], array['Blend beans.','Season batter.','Pour into cups.','Steam until set.'], '50 min', 'Medium', array['healthy','cheap','local']),
('nigeria-jollof', 'Party Jollof Bowl', 'Smoky tomato rice with vegetables.', 'Nigeria', 'dinner', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/EfZEArZcfAY', array['Rice','Tomato stew','Stock','Onion','Thyme','Bay leaf'], array['Reduce stew.','Add stock.','Stir in rice.','Steam until fluffy.'], '55 min', 'Medium', array['quick','cheap','local']),
('uk-porridge', 'Berry Porridge', 'Creamy oats with berries and honey.', 'United Kingdom', 'breakfast', 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/ywkEGKXk2cQ', array['Oats','Milk','Berries','Honey','Salt'], array['Simmer oats and milk.','Stir until creamy.','Top with berries.','Drizzle honey.'], '10 min', 'Easy', array['quick','healthy','cheap']),
('uk-beans-toast', 'Beans on Toast', 'Warm beans on crisp toast.', 'United Kingdom', 'breakfast', 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/wVIhQ9d2L9w', array['Bread','Baked beans','Butter','Pepper','Cheddar'], array['Toast bread.','Warm beans.','Spoon beans over toast.','Add pepper and cheese.'], '8 min', 'Easy', array['quick','cheap','local']),
('uk-jacket-potato', 'Tuna Jacket Potato', 'Fluffy potato with tuna and sweetcorn.', 'United Kingdom', 'lunch', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/vxQDD8mxk2c', array['Potato','Tuna','Sweetcorn','Greek yogurt','Chives'], array['Cook potato.','Mix tuna filling.','Split potato.','Fill and serve.'], '20 min', 'Easy', array['quick','healthy','cheap']),
('brazil-acai', 'Acai Banana Bowl', 'Chilled acai bowl with granola.', 'Brazil', 'breakfast', 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/mN-fX2k8rZg', array['Acai puree','Banana','Granola','Berries','Honey'], array['Blend acai and banana.','Spoon into bowl.','Top with granola.','Add honey.'], '7 min', 'Easy', array['quick','healthy','local']),
('brazil-pao-queijo', 'Pao de Queijo', 'Chewy Brazilian cheese bread.', 'Brazil', 'breakfast', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/e1cN2vc1a2A', array['Tapioca flour','Milk','Oil','Eggs','Cheese','Salt'], array['Warm milk and oil.','Mix with flour.','Add eggs and cheese.','Bake until puffed.'], '35 min', 'Medium', array['quick','local','cheap']),
('brazil-feijoada-lite', 'Feijoada Lite', 'Black bean bowl with rice and orange.', 'Brazil', 'dinner', 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/x9N0d9oTxHk', array['Black beans','Rice','Garlic','Onion','Paprika','Orange'], array['Saute garlic and onion.','Add beans.','Simmer.','Serve with rice.'], '40 min', 'Easy', array['healthy','cheap','local']),
('us-avocado-toast', 'Avocado Egg Toast', 'Toast with avocado and egg.', 'United States', 'breakfast', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/Wmo1NoYEFPw', array['Bread','Avocado','Egg','Lime','Chilli','Salt'], array['Toast bread.','Mash avocado.','Cook egg.','Layer and serve.'], '12 min', 'Easy', array['quick','healthy']),
('us-pancakes', 'Mini Pancake Stack', 'Fluffy pancakes with fruit.', 'United States', 'breakfast', 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/FLd00Bx4tOk', array['Flour','Egg','Milk','Baking powder','Syrup','Fruit'], array['Whisk batter.','Cook rounds.','Flip once.','Stack and serve.'], '20 min', 'Easy', array['quick','cheap']),
('us-turkey-wrap', 'Turkey Crunch Wrap', 'Turkey wrap with greens.', 'United States', 'lunch', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/5qk9vS6nZrs', array['Tortilla','Turkey','Lettuce','Tomato','Yogurt','Herbs'], array['Mix sauce.','Layer filling.','Drizzle sauce.','Roll and slice.'], '10 min', 'Easy', array['quick','healthy','cheap']),
('india-poha', 'Lemon Poha', 'Flattened rice with peanuts and lemon.', 'India', 'breakfast', 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/h8J0Q3hRzUI', array['Poha','Peanuts','Onion','Turmeric','Mustard seeds','Lemon'], array['Rinse poha.','Toast peanuts.','Cook onion.','Fold in poha.'], '15 min', 'Easy', array['quick','cheap','local']),
('india-masala-omelette', 'Masala Omelette', 'Eggs with chilli, tomato, and coriander.', 'India', 'breakfast', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/qXPhVYpQLPA', array['Eggs','Onion','Tomato','Green chilli','Coriander','Salt'], array['Beat eggs.','Add vegetables.','Cook in pan.','Flip and serve.'], '10 min', 'Easy', array['quick','cheap']),
('ghana-hausa-koko', 'Hausa Koko', 'Spiced millet porridge.', 'Ghana', 'breakfast', 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/eu0cZs5jD1A', array['Millet flour','Ginger','Cloves','Sugar','Water','Peanuts'], array['Mix millet.','Boil spices.','Whisk in millet.','Serve with peanuts.'], '18 min', 'Easy', array['quick','cheap','local']),
('ghana-waakye', 'Waakye Bowl', 'Rice and beans with stew.', 'Ghana', 'lunch', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/dVzNn3L2oKQ', array['Rice','Beans','Egg','Tomato stew','Cabbage','Shito'], array['Cook beans.','Add rice.','Boil egg.','Serve with stew.'], '55 min', 'Medium', array['healthy','cheap','local']),
('other-shakshuka', 'Shakshuka Skillet', 'Eggs in tomato pepper sauce.', 'Other', 'breakfast', 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/ifWWRZSWS18', array['Eggs','Tomatoes','Bell pepper','Onion','Paprika','Parsley'], array['Cook onion and pepper.','Add tomatoes.','Crack in eggs.','Cover until set.'], '25 min', 'Easy', array['healthy','cheap']),
('other-greek-yogurt', 'Greek Yogurt Crunch', 'Yogurt, fruit, nuts, and granola.', 'Other', 'breakfast', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/ZkjX5o_8K6M', array['Greek yogurt','Granola','Banana','Berries','Nuts','Honey'], array['Spoon yogurt.','Add fruit.','Sprinkle granola.','Finish with honey.'], '5 min', 'Easy', array['quick','healthy']),
('other-veggie-noodles', 'Veggie Noodle Stir Fry', 'Fast noodles with vegetables.', 'Other', 'dinner', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/aA0G6x8xwBQ', array['Noodles','Carrot','Cabbage','Soy sauce','Ginger','Sesame oil'], array['Cook noodles.','Stir fry vegetables.','Add sauce.','Toss noodles.'], '18 min', 'Easy', array['quick','cheap','healthy']),
('brazil-tapioca-crepe', 'Tapioca Breakfast Crepe', 'Tapioca crepe with cheese and tomato.', 'Brazil', 'breakfast', 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/8BVmN15F6mc', array['Tapioca starch','Cheese','Tomato','Oregano','Salt'], array['Sift starch into pan.','Cook into crepe.','Add filling.','Fold and serve.'], '12 min', 'Easy', array['quick','local'])
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  country = excluded.country,
  meal_type = excluded.meal_type,
  image_url = excluded.image_url,
  video_url = excluded.video_url,
  ingredients = excluded.ingredients,
  cooking_steps = excluded.cooking_steps,
  cooking_time = excluded.cooking_time,
  difficulty = excluded.difficulty,
  tags = excluded.tags;

update public.meals as meal
set image_url = fixed.image_url
from (
  values
    ('nigeria-akara-pap', 'https://commons.wikimedia.org/wiki/Special:FilePath/Akara%20na%20Akamu%20%28Fried%20Bean%20cakes%20and%20Pap%29.jpg'),
    ('nigeria-yam-egg', 'https://commons.wikimedia.org/wiki/Special:FilePath/Boiled%20yam%20and%20egg%20sauce.jpg'),
    ('nigeria-moi-moi', 'https://commons.wikimedia.org/wiki/Special:FilePath/Making%20of%20Moi-moi%201.jpg'),
    ('nigeria-jollof', 'https://commons.wikimedia.org/wiki/Special:FilePath/Jollof%20%28Jollof-%20Rice%29.jpg'),
    ('uk-porridge', 'https://commons.wikimedia.org/wiki/Special:FilePath/Porridge%20with%20berries.JPG'),
    ('uk-beans-toast', 'https://commons.wikimedia.org/wiki/Special:FilePath/Beans%20on%20toast.jpg'),
    ('uk-jacket-potato', 'https://commons.wikimedia.org/wiki/Special:FilePath/Baked%20potato%20with%20tuna%2C%20sweetcorn%20and%20mayonnaise%20-%20Waitrose%20caf%C3%A9%2C%20Worthing%202025-12-11.jpg'),
    ('brazil-acai', 'https://commons.wikimedia.org/wiki/Special:FilePath/Acai%20bowl%20%2843110767814%29.jpg'),
    ('brazil-pao-queijo', 'https://commons.wikimedia.org/wiki/Special:FilePath/Pao%20de%20queijo%20%284813929850%29.jpg'),
    ('brazil-feijoada-lite', 'https://commons.wikimedia.org/wiki/Special:FilePath/Feijoada%20%284808711154%29.jpg'),
    ('brazil-tapioca-crepe', 'https://commons.wikimedia.org/wiki/Special:FilePath/Tapioca%20com%20queijo%20coalho%209354%20orig.jpg'),
    ('india-poha', 'https://commons.wikimedia.org/wiki/Special:FilePath/Flattened%20Rice%20%28Poha%29%20%2849684434042%29.jpg'),
    ('india-masala-omelette', 'https://commons.wikimedia.org/wiki/Special:FilePath/Masala%20Omelette.jpg'),
    ('ghana-hausa-koko', 'https://commons.wikimedia.org/wiki/Special:FilePath/Hausa%20Kooko%20and%20Koose.jpg'),
    ('ghana-waakye', 'https://commons.wikimedia.org/wiki/Special:FilePath/Waakye%2C%20a%20delicious%20delicacy%20in%20Ghana.jpg'),
    ('other-shakshuka', 'https://commons.wikimedia.org/wiki/Special:FilePath/Shakshuka%20%28Unsplash%29.jpg'),
    ('other-greek-yogurt', 'https://commons.wikimedia.org/wiki/Special:FilePath/Fruit%2C%20yogurt%2C%20granola%20%2833887713066%29.jpg'),
    ('other-veggie-noodles', 'https://commons.wikimedia.org/wiki/Special:FilePath/Vegetable%20Noodles.jpg'),
    ('us-turkey-wrap', 'https://commons.wikimedia.org/wiki/Special:FilePath/CookbookTurkeyWrap.jpg')
) as fixed(id, image_url)
where meal.id = fixed.id;
