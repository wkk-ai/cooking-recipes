-- Recreates the recipes table from "Caderno de receita.pptx" (Sara de Sá).
-- Plain Postgres (Neon). Photos stay as files in public/images/recipes.
-- Unknown in the notebook: description, difficulty, prep_time (set to defaults).

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  description text not null default '',
  category text not null default 'Confeitaria',
  difficulty text not null default 'Fácil',
  prep_time integer not null default 0,
  cook_time integer not null default 0,
  servings integer,
  image_url text not null default '',
  ingredients jsonb not null default '[]'::jsonb,
  instructions jsonb not null default '[]'::jsonb
);

insert into public.recipes
  (title, description, category, difficulty, prep_time, cook_time, servings, image_url, ingredients, instructions)
values
  ('Cookies chocotudo', '', 'Confeitaria', 'Fácil', 0, 10, null, '/images/recipes/cookies_chocotudo.png',
   '[{"quantity": "120g", "name": "açúcar refinado"}, {"quantity": "120g", "name": "açúcar mascavo"}, {"quantity": "100g", "name": "margaria (70% de gordura)"}, {"quantity": "1", "name": "ovo"}, {"quantity": "270g", "name": "farinha de trigo"}, {"quantity": "1 colher de chá", "name": "fermento em pó (bicabornato)"}, {"quantity": "2 gotas", "name": "Baunilha"}, {"quantity": "200g", "name": "chocolate picado"}]'::jsonb,
   '["Bata a manteiga, o açúcar e o açúcar mascavo até virar um creme fofo e leve (até emulsionar). Adicione o ovo.", "Junte a farinha, fermento e baunilha, bata apenas até misturar. Junte o chocolate, apenas para incorporar na massa.", "Bolei e asse no forno pré aquecido à 170° por aproximadamente 10 minutos.", "(mesmo se for assar na hora, esperar gelar um pouco os cookies)"]'::jsonb),
  ('Bolo formigueiro', '', 'Confeitaria', 'Fácil', 0, 30, 2, '/images/recipes/bolo_formigueiro.png',
   '[{"quantity": "4", "name": "ovos"}, {"quantity": "1,5 copos", "name": "açúcar (300g)"}, {"quantity": "2 copos", "name": "farinha (280g)"}, {"quantity": "200g", "name": "margarina (70% de gordura)"}, {"quantity": "100g", "name": "coco ralado"}, {"quantity": "1 colher de sopa", "name": "fermento"}, {"quantity": "1 copo", "name": "leite (240 ml)"}, {"quantity": "150g", "name": "granulado"}, {"quantity": "", "name": "Rum"}, {"quantity": "", "name": "Leite condensado"}]'::jsonb,
   '["Bater o açúcar e margarina até emulsificar", "Acrescentar gema e bater", "Misturar coco, farinha e fermento  bater na massa apenas para incorporar. Ir acrescentando aos poucos o leite", "Acrescentar o granulado, apenas juntar", "Colar a clara em neve (clara do avo batida)  mexer na mão", "Assar no forno pré aquecido à 160° por 30 min", "Ao desenformar, regar com rum misturado com leite condensado.", "Rende 2 bolos"]'::jsonb),
  ('Bolachinha', '', 'Confeitaria', 'Fácil', 0, 15, null, '/images/recipes/bolachinha.png',
   '[{"quantity": "100g", "name": "açúcar refinado"}, {"quantity": "200g", "name": "margarina (70% de gordura)"}, {"quantity": "300g", "name": "farinha"}]'::jsonb,
   '["Misturar todos os ingredientes (não mexer muito para não endurecer)", "Bolear e amassar com um garfo", "Assar no forno pré aquecido à 180° por 12 a 15 minutos"]'::jsonb),
  ('Brownie', '', 'Confeitaria', 'Fácil', 0, 30, null, '/images/recipes/brownie.png',
   '[{"quantity": "150g", "name": "chocolate meio amargo"}, {"quantity": "50g", "name": "chocolate amargo"}, {"quantity": "100g", "name": "manteiga sem sal"}, {"quantity": "18g", "name": "chocolate em pó"}, {"quantity": "280g", "name": "açúcar"}, {"quantity": "3", "name": "ovos"}, {"quantity": "10 ml", "name": "extrato de baunilha"}, {"quantity": "225g", "name": "farinha"}]'::jsonb,
   '["Derreta em banho maria os chocolates com a manteiga", "Adicione o chocolate em pó e misture", "Em outra vasilha, colocar os ovos, açúcar e extrato de baunilha, mexer até o açúcar dissolver", "Adicione a mistura do chocolate derretido, misture tudo e acrescente a farinha até ela sumir", "Assar em forno pré aquecido à 180° por 30 minutos"]'::jsonb),
  ('Petit gâteau', '', 'Sobremesas', 'Fácil', 0, 4, null, '/images/recipes/petit_gateau.png',
   '[{"quantity": "250g", "name": "manteiga sem sal"}, {"quantity": "300g", "name": "chocolate meio amargo"}, {"quantity": "5", "name": "gemas"}, {"quantity": "5", "name": "ovos inteiros"}, {"quantity": "170g", "name": "açúcar"}, {"quantity": "100g", "name": "farinha de trigo"}]'::jsonb,
   '["Derreter a manteiga e o chocolate no micro-ondas", "Bater as gemas, os ovos, o açúcar e, por último, a farinha", "Adicione o chocolate derretido a mistura e bata até ficar homogêneo", "Asse no forno pré aquecido à 180° por 4 minutos"]'::jsonb),
  ('Pudim', '', 'Sobremesas', 'Fácil', 0, 90, null, '/images/recipes/pudim.png',
   '[{"quantity": "4", "name": "ovos"}, {"quantity": "1 lata", "name": "leite condensado"}, {"quantity": "2 latas", "name": "leite (mesma do leite condensado)"}, {"quantity": "", "name": "Calda:"}, {"quantity": "1 xícara", "name": "açúcar"}, {"quantity": "1 xícara", "name": "água"}]'::jsonb,
   '["Bater todos os ingredientes no liquidificador.", "Calda: Na forma que for fazer o pudim, derreter o açúcar (ficar mexendo sem parar). – depois, jogar 1 copo de água fervida.", "Jogar por cima da calda a mistura. Colocar no banho maria e tampar com um papel alumínio.", "Forno do fogão no máximo por 1h30."]'::jsonb),
  ('Merengue', '', 'Confeitaria', 'Fácil', 0, 0, null, '/images/recipes/merengue.jpg',
   '[{"quantity": "3", "name": "ovos"}, {"quantity": "1 xícara", "name": "açúcar (200g)"}]'::jsonb,
   '["Aquecer as claras com o açúcar em uma panela, mexer até amornar e desaparecer as bolinhas de açúcar (60° - conseguir manter o dedo na panela)", "Levar para a batedeira e bater por uns 30 min"]'::jsonb),
  ('Suspiros', '', 'Confeitaria', 'Fácil', 0, 60, null, '/images/recipes/suspiros.jpg',
   '[{"quantity": "2", "name": "ovos"}, {"quantity": "100g", "name": "açúcar"}]'::jsonb,
   '["Bata a clara do ovo por 7 minutos (2 em velocidade baixa e os 5 em maior velocidade) – quando levantar o batedor, a clara não vai se desprender", "Continuar batendo em velocidade alta e ir adicionar o açúcar aos poucos, uma colher por vez, até usar todo o açúcar", "Asse em um forno pré aquecido em uma temperatura baixa, deixe assar por aproximadamente 1 hora com a porta do forno entreaberta"]'::jsonb),
  ('Torta de limão', '', 'Sobremesas', 'Fácil', 0, 0, null, '/images/recipes/torta_limao.jpg',
   '[{"quantity": "", "name": "Massa sablée"}, {"quantity": "200g", "name": "farinha"}, {"quantity": "100g", "name": "manteiga sem sal"}, {"quantity": "100g", "name": "açúcar de confeiteiro"}, {"quantity": "1", "name": "ovo"}, {"quantity": "", "name": "Recheio"}, {"quantity": "400g", "name": "leite condensado"}, {"quantity": "150g", "name": "creme de leite"}, {"quantity": "100ml", "name": "limão"}]'::jsonb,
   '["Misture a farinha com o açúcar, acrescente a manteiga em temperatura ambiente e por fim, adicione o ovo. Deixe descansar por 30 min na geladeira e depois pode abrir e usar a massa.", "Moldar a massa, furar com um garfo e assar em forno pré aquecido a 180°", "Misturar os ingredientes em uma vasilha e bater com o fuet", "Despejar sobre o fundo da massa assada", "Enfeitar com o merengue e dourar no forno"]'::jsonb),
  ('Pizza', '', 'Pratos Principais', 'Fácil', 0, 7, null, '/images/recipes/pizza.jpg',
   '[{"quantity": "500g", "name": "farinha de trigo"}, {"quantity": "25g", "name": "azeite"}, {"quantity": "15g", "name": "açúcar"}, {"quantity": "10g", "name": "sal"}, {"quantity": "5g", "name": "fermento granulado (biológico)"}, {"quantity": "250g a 255g", "name": "água"}]'::jsonb,
   '["Colocar todos os ingredientes na batedeira (colocar primeiro a água)", "Bater até obter ponto de véu", "Deixar a massa descansar por 1 hora", "Dividir a massa nos tamanhos desejados deixar descansar em bolinha por 30 min", "Abrir a massa com os dedos, colocar recheio", "Assar no forno pré aquecido à 250° por 7 minutos"]'::jsonb),
  ('Torta neutra de guaraná', '', 'Pratos Principais', 'Fácil', 0, 40, 1, '/images/recipes/torta_guarana.jpg',
   '[{"quantity": "200g", "name": "farinha de trigo"}, {"quantity": "100g", "name": "margarina"}, {"quantity": "60ml", "name": "guaraná"}]'::jsonb,
   '["Misturar a farinha e margarina", "Acrescentar o guaraná até dar o ponto", "Descansar na geladeira por 15 min", "Abrir com rolo, espessura fina e forrar a assadeira. Rechear e cobrir com a outra parte da massa, pincelar e assar", "Assar em forno pré aquecido por 30 a 40 min", "Rende 1 torta"]'::jsonb),
  ('Polpetone', '', 'Carnes', 'Fácil', 0, 0, null, '/images/recipes/polpetone.jpg',
   '[{"quantity": "1kg", "name": "carne moída"}, {"quantity": "94g", "name": "farinha de rosca"}, {"quantity": "94ml", "name": "molho de tomate"}, {"quantity": "15ml", "name": "óleo"}, {"quantity": "1", "name": "ovo"}, {"quantity": "0,5 colher de sopa", "name": "sal"}, {"quantity": "125g", "name": "cebola"}, {"quantity": "", "name": "Queijo"}]'::jsonb,
   '["Misturar todos os ingredientes", "Modelar deixando um cubo de queijo no meio", "Assar"]'::jsonb),
  ('Dadinho de tapioca', '', 'Acompanhamentos', 'Fácil', 0, 15, null, '/images/recipes/dadinho_tapioca.jpg',
   '[{"quantity": "250g", "name": "tapioca granulada"}, {"quantity": "250g", "name": "queijo coalho"}, {"quantity": "500ml", "name": "leite integral"}, {"quantity": "", "name": "Sal a gosto"}]'::jsonb,
   '["Ferver o leite com o sal", "Despejar sobre a tapioca misturada com o queijo coalho ralado grosso", "Colocar em uma assadeira forrada com plástico e levar à geladeira (ou frízer) para que fique bem firme", "Cortar em quadradinho e fritar em óleo quente ou assar em forma untada à 200° por 10 a 15 min"]'::jsonb);
