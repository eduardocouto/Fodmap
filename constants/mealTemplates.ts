import type { MealTemplate } from '../types';
import { MealSlot } from '../types';

export const MEAL_TEMPLATES: MealTemplate[] = [
  // Pequeno-almoço
  {
    id: 'pequeno-almoco-pao-fruta',
    name: 'Pão e Fruta',
    description: 'Uma opção clássica e equilibrada para começar o dia.',
    category: MealSlot.BREAKFAST,
    items: [
      { foodId: 'pao-sem-gluten-arroz-milho-tapioca', amount: 52 },
      { foodId: 'queijo-feta', amount: 40 },
      { foodId: 'laranja-navel', amount: 130 },
    ],
  },
  {
    id: 'pequeno-almoco-aveia',
    name: 'Papas de Aveia',
    description: 'Papas de aveia quentes e saciantes com frutos vermelhos e sementes.',
    category: MealSlot.BREAKFAST,
    items: [
      { foodId: 'flocos-aveia', amount: 52 },
      { foodId: 'mirtilos', amount: 40 },
      { foodId: 'sementes-chia', amount: 24 },
    ],
  },
  {
    id: 'pequeno-almoco-smoothie',
    name: 'Batido Verde',
    description: 'Um batido rápido e nutritivo para levar.',
    category: MealSlot.BREAKFAST,
    items: [
      { foodId: 'banana-nao-madura', amount: 95 },
      { foodId: 'espinafre', amount: 40 },
      { foodId: 'bebida-amendoas', amount: 200 },
      { foodId: 'sementes-linhaca', amount: 15 },
    ],
  },
  {
    id: 'pequeno-almoco-ovos-espinafres',
    name: 'Ovos Mexidos com Espinafres',
    description: 'Um pequeno-almoço rico em proteínas para começar bem o dia.',
    category: MealSlot.BREAKFAST,
    items: [
      { foodId: 'ovo', amount: 2 },
      { foodId: 'espinafre', amount: 75 },
      { foodId: 'pao-sem-gluten-arroz-milho-tapioca', amount: 52 },
    ],
  },
  {
    id: 'pequeno-almoco-iogurte-nozes',
    name: 'Iogurte com Banana e Nozes',
    description: 'Uma combinação cremosa e crocante, cheia de energia.',
    category: MealSlot.BREAKFAST,
    items: [
      { foodId: 'iogurte-sem-lactose', amount: 170 },
      { foodId: 'banana-nao-madura', amount: 50 },
      { foodId: 'nozes', amount: 30 },
    ],
  },

  // Almoço
  {
    id: 'almoco-frango-arroz',
    name: 'Frango e Arroz',
    description: 'Uma refeição completa e segura com proteína, hidratos de carbono e legumes.',
    category: MealSlot.LUNCH,
    items: [
      { foodId: 'proteina-carne-peixe', amount: 150 },
      { foodId: 'arroz-branco', amount: 190 },
      { foodId: 'brocolos-flor', amount: 75 },
    ],
  },
  {
    id: 'almoco-salmao-quinoa',
    name: 'Salmão e Quinoa',
    description: 'Uma refeição saudável e saborosa, rica em ómega-3.',
    category: MealSlot.LUNCH,
    items: [
      { foodId: 'proteina-carne-peixe', amount: 150 }, // Represents Salmon
      { foodId: 'quinoa', amount: 155 },
      { foodId: 'curgete-abobrinha', amount: 67 },
      { foodId: 'pimento-vermelho', amount: 43 },
    ],
  },
  {
    id: 'almoco-salada-quinoa',
    name: 'Salada de Quinoa Fresca',
    description: 'Uma salada leve, colorida e muito nutritiva.',
    category: MealSlot.LUNCH,
    items: [
      { foodId: 'quinoa', amount: 155 },
      { foodId: 'pepino-continental', amount: 75 },
      { foodId: 'pimento-vermelho', amount: 43 },
      { foodId: 'queijo-feta', amount: 40 },
    ],
  },
  {
    id: 'almoco-batata-doce-recheada',
    name: 'Batata Doce Recheada',
    description: 'Uma refeição vegetariana reconfortante e cheia de sabor.',
    category: MealSlot.LUNCH,
    items: [
      { foodId: 'batata-doce-laranja', amount: 150 },
      { foodId: 'grao-de-bico-enlatado', amount: 80 },
      { foodId: 'rucula', amount: 40 },
    ],
  },

  // Jantar
  {
    id: 'jantar-ovos-batata',
    name: 'Ovos e Batatas',
    description: 'Uma opção de jantar simples, satisfatória e rápida.',
    category: MealSlot.DINNER,
    items: [
      { foodId: 'ovo', amount: 2 },
      { foodId: 'batata-branca-com-pele', amount: 150 },
      { foodId: 'cenoura', amount: 75 },
    ],
  },
  {
    id: 'jantar-massa-sem-gluten',
    name: 'Massa Sem Glúten',
    description: 'Comida de conforto clássica, em versão baixa em FODMAPs.',
    category: MealSlot.DINNER,
    items: [
      { foodId: 'massa-sem-gluten-milho-arroz', amount: 80 },
      { foodId: 'polpa-de-tomate', amount: 28 },
      { foodId: 'cenoura', amount: 50 },
      { foodId: 'manjericao-fresco', amount: 10 },
    ],
  },
  {
    id: 'jantar-stir-fry',
    name: 'Tofu Salteado',
    description: 'Um prato rápido e saboroso de inspiração asiática.',
    category: MealSlot.DINNER,
    items: [
      { foodId: 'tofu-firme-plain', amount: 170 },
      { foodId: 'arroz-branco', amount: 190 },
      { foodId: 'bok-choy', amount: 75 },
      { foodId: 'molho-soja', amount: 20 },
    ],
  },
   {
    id: 'jantar-peixe-batatas',
    name: 'Peixe com Batata Assada',
    description: 'Um jantar simples, clássico e sempre delicioso.',
    category: MealSlot.DINNER,
    items: [
      { foodId: 'proteina-carne-peixe', amount: 150 }, // Representa Peixe
      { foodId: 'batata-vermelha-com-pele', amount: 150 },
      { foodId: 'feijao-verde-redondo', amount: 75 },
    ],
  },
  {
    id: 'jantar-curry-legumes',
    name: 'Caril de Legumes',
    description: 'Um caril cremoso e aromático, servido com arroz basmati.',
    category: MealSlot.DINNER,
    items: [
      { foodId: 'leite-coco-enlatado', amount: 100 },
      { foodId: 'arroz-basmati', amount: 190 },
      { foodId: 'cenoura', amount: 75 },
      { foodId: 'curgete-abobrinha', amount: 67 },
      { foodId: 'caril-po', amount: 2 },
    ],
  },

  // Lanches
  {
    id: 'lanche-iogurte-fruta',
    name: 'Iogurte e Mirtilos',
    description: 'Uma opção leve e refrescante para um lanche.',
    category: MealSlot.SNACKS,
    items: [
      { foodId: 'iogurte-sem-lactose', amount: 170 },
      { foodId: 'mirtilos', amount: 60 },
    ],
  },
  {
    id: 'lanche-galetes-amendoim',
    name: 'Galetes de Arroz',
    description: 'Um lanche crocante e satisfatório.',
    category: MealSlot.SNACKS,
    items: [
      { foodId: 'galetes-arroz', amount: 28 },
      { foodId: 'manteiga-amendoim', amount: 30 },
    ],
  },
  {
    id: 'lanche-mix-frutos-secos',
    name: 'Mix de Frutos Secos',
    description: 'Um punhado de frutos secos simples para aumentar a energia.',
    category: MealSlot.SNACKS,
    items: [
      { foodId: 'amendoins', amount: 28 },
    ],
  },
  {
    id: 'lanche-salada-fruta',
    name: 'Salada de Fruta',
    description: 'Uma mistura fresca e doce de frutas seguras.',
    category: MealSlot.SNACKS,
    items: [
      { foodId: 'morangos', amount: 65 },
      { foodId: 'kiwi', amount: 75 },
    ],
  },
  {
    id: 'lanche-queijo-tostas',
    name: 'Queijo e Tostas de Arroz',
    description: 'Um lanche simples, rápido e crocante.',
    category: MealSlot.SNACKS,
    items: [
      { foodId: 'queijo-cheddar', amount: 40 },
      { foodId: 'tostas-arroz', amount: 24 },
    ],
  },
  {
    id: 'lanche-cenoura-amendoim',
    name: 'Cenoura e Manteiga de Amendoim',
    description: 'Um snack saudável que combina doce e salgado.',
    category: MealSlot.SNACKS,
    items: [
      { foodId: 'cenoura', amount: 100 },
      { foodId: 'manteiga-amendoim', amount: 30 },
    ],
  },
  {
    id: 'lanche-banana-chocolate',
    name: 'Banana e Chocolate Preto',
    description: 'Um mimo doce para quando apetece algo especial.',
    category: MealSlot.SNACKS,
    items: [
      { foodId: 'banana-nao-madura', amount: 95 },
      { foodId: 'chocolate-preto-85', amount: 20 },
    ],
  },

  // Sopas
  {
    id: 'sopa-cenoura-gengibre',
    name: 'Sopa de Cenoura e Gengibre',
    description: 'Uma sopa reconfortante e vibrante.',
    category: 'Sopa',
    items: [
      { foodId: 'cenoura', amount: 200 },
      { foodId: 'batata-branca-com-pele', amount: 100 },
      { foodId: 'gengibre', amount: 5 },
      { foodId: 'folhas-alho-frances', amount: 50 },
    ],
    type: 'soup',
  },
  {
    id: 'sopa-abobora',
    name: 'Sopa de Abóbora',
    description: 'Um clássico cremoso e reconfortante.',
    category: 'Sopa',
    items: [
      { foodId: 'abobora-manteiga', amount: 250 },
      { foodId: 'cenoura', amount: 75 },
      { foodId: 'leite-coco-enlatado', amount: 60 },
    ],
    type: 'soup',
  },
  {
    id: 'sopa-frango-noodles',
    name: 'Canja de Galinha',
    description: 'Uma versão baixa em FODMAPs da derradeira comida de conforto.',
    category: 'Sopa',
    items: [
        { foodId: 'proteina-carne-peixe', amount: 100 },
        { foodId: 'noodles-arroz-rice-stick', amount: 100 },
        { foodId: 'cenoura', amount: 50 },
        { foodId: 'folhas-alho-frances', amount: 50 },
    ],
    type: 'soup',
  },
  {
    id: 'sopa-tomate-manjericao',
    name: 'Sopa de Tomate e Manjericão',
    description: 'Uma sopa de tomate clássica, leve e saborosa.',
    category: 'Sopa',
    items: [
      { foodId: 'tomate-enlatado', amount: 180 },
      { foodId: 'cenoura', amount: 50 },
      { foodId: 'manjericao-fresco', amount: 10 },
    ],
    type: 'soup',
  },
  {
    id: 'sopa-verde-legumes',
    name: 'Sopa de Legumes Verdes',
    description: 'Uma sopa de legumes verdes nutritiva e cremosa.',
    category: 'Sopa',
    items: [
      { foodId: 'curgete-abobrinha', amount: 100 },
      { foodId: 'folhas-alho-frances', amount: 75 },
      { foodId: 'batata-branca-com-pele', amount: 100 },
      { foodId: 'espinafre', amount: 75 },
    ],
    type: 'soup',
  },
  {
    id: 'sopa-pimento-vermelho',
    name: 'Sopa de Pimento Vermelho e Batata',
    description: 'Uma sopa de pimento vermelho assado, fumada e robusta.',
    category: 'Sopa',
    items: [
      { foodId: 'pimento-vermelho', amount: 70 },
      { foodId: 'batata-branca-com-pele', amount: 150 },
      { foodId: 'tomate-enlatado', amount: 100 },
      { foodId: 'paprika', amount: 2 },
    ],
    type: 'soup',
  },
];

const aiDescription = 'Refeição do plano anti-inflamatório. Pode conter FODMAPs. Ajuste conforme tolerância.';

export const ANTI_INFLAMMATORY_PLAN: MealTemplate[] = [
  // DIA 1
  {
    id: 'ai-dia1-pequeno-almoco', name: 'Sopa de cevada com lentilhas e vegetais', description: aiDescription, category: 'Plano AI - Dia 1', type: 'soup',
    items: [{ foodId: 'cevada-cozida', amount: 60 }, { foodId: 'lentilhas-vermelhas-cozidas', amount: 100 }, { foodId: 'cenoura', amount: 75 }, { foodId: 'aipo', amount: 75 }, { foodId: 'cebola', amount: 75 }]
  },
  {
    id: 'ai-dia1-almoco', name: 'Palitos de pescado caseiros (sem fritar)', description: aiDescription, category: 'Plano AI - Dia 1',
    items: [{ foodId: 'proteina-carne-peixe', amount: 200 }, { foodId: 'farinha-de-milho', amount: 30 }, { foodId: 'pao-ralado', amount: 15 }]
  },
  {
    id: 'ai-dia1-jantar', name: 'Madalenas salgadas com espinafres e queijo vegetal', description: aiDescription, category: 'Plano AI - Dia 1',
    items: [{ foodId: 'farinha-trigo-comum', amount: 100 }, { foodId: 'espinafre', amount: 50 }, { foodId: 'queijo-vegan-coco', amount: 40 }, { foodId: 'ovo', amount: 2 }]
  },
  {
    id: 'ai-dia1-lanche', name: 'Batido doce com plátano, cacau e leite de aveia', description: aiDescription, category: 'Plano AI - Dia 1',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'cacau-po', amount: 5 }, { foodId: 'bebida-aveia', amount: 200 }]
  },
  // DIA 2
  {
    id: 'ai-dia2-pequeno-almoco', name: 'Massa integral com ragu de lentilhas', description: aiDescription, category: 'Plano AI - Dia 2',
    items: [{ foodId: 'massa-integral-cozida', amount: 80 }, { foodId: 'lentilhas-vermelhas-cozidas', amount: 100 }, { foodId: 'cenoura', amount: 40 }, { foodId: 'polpa-de-tomate', amount: 200 }]
  },
  {
    id: 'ai-dia2-almoco', name: 'Tortilha com ervas e batatas-doces', description: aiDescription, category: 'Plano AI - Dia 2',
    items: [{ foodId: 'ovo', amount: 2 }, { foodId: 'salsa-fresca', amount: 100 }, { foodId: 'batata-doce-laranja', amount: 100 }]
  },
  {
    id: 'ai-dia2-jantar', name: 'Tortitas proteicas com plátano e aveia', description: aiDescription, category: 'Plano AI - Dia 2',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'flocos-aveia', amount: 30 }, { foodId: 'ovo', amount: 1 }]
  },
  {
    id: 'ai-dia2-lanche', name: 'Sopa cremosa de cenoura e batata', description: aiDescription, category: 'Plano AI - Dia 2', type: 'soup',
    items: [{ foodId: 'cenoura', amount: 200 }, { foodId: 'batata-branca-com-pele', amount: 150 }]
  },
  // DIA 3
  {
    id: 'ai-dia3-pequeno-almoco', name: 'Mini pizzas com base de batata-doce', description: aiDescription, category: 'Plano AI - Dia 3',
    items: [{ foodId: 'batata-doce-laranja', amount: 200 }, { foodId: 'farinha-trigo-comum', amount: 40 }, { foodId: 'pure-de-tomate', amount: 60 }]
  },
  {
    id: 'ai-dia3-almoco', name: 'Batido de proteínas vegetais e cacau', description: aiDescription, category: 'Plano AI - Dia 3',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'bebida-amendoas', amount: 200 }, { foodId: 'proteina-vegetal-po', amount: 25 }, { foodId: 'cacau-po', amount: 5 }]
  },
  {
    id: 'ai-dia3-jantar', name: 'Massa de leguminosas com brócolos e azeite de linhaça', description: aiDescription, category: 'Plano AI - Dia 3',
    items: [{ foodId: 'massa-grao-de-bico', amount: 80 }, { foodId: 'brocolos-flor', amount: 150 }, { foodId: 'azeite-linhaca', amount: 10 }]
  },
  {
    id: 'ai-dia3-lanche', name: 'Croquetes de vegetais ao forno', description: aiDescription, category: 'Plano AI - Dia 3',
    items: [{ foodId: 'cenoura', amount: 200 }, { foodId: 'farinha-grao-de-bico', amount: 15 }, { foodId: 'pao-ralado', amount: 15 }]
  },
  // DIA 4
  {
    id: 'ai-dia4-pequeno-almoco', name: 'Barras caseiras com sementes, aveia e frutos secos', description: aiDescription, category: 'Plano AI - Dia 4',
    items: [{ foodId: 'flocos-aveia', amount: 80 }, { foodId: 'nozes', amount: 40 }, { foodId: 'sementes-chia', amount: 20 }]
  },
  {
    id: 'ai-dia4-almoco', name: 'Palitos de pescado caseiros (sem fritar)', description: aiDescription, category: 'Plano AI - Dia 4',
    items: [{ foodId: 'proteina-carne-peixe', amount: 200 }, { foodId: 'farinha-de-milho', amount: 30 }, { foodId: 'pao-ralado', amount: 15 }]
  },
  {
    id: 'ai-dia4-jantar', name: 'Massa integral com ragu de lentilhas', description: aiDescription, category: 'Plano AI - Dia 4',
    items: [{ foodId: 'massa-integral-cozida', amount: 80 }, { foodId: 'lentilhas-vermelhas-cozidas', amount: 100 }, { foodId: 'cenoura', amount: 40 }, { foodId: 'polpa-de-tomate', amount: 200 }]
  },
  {
    id: 'ai-dia4-lanche', name: 'Crepes integrais com creme de maçã', description: aiDescription, category: 'Plano AI - Dia 4',
    items: [{ foodId: 'farinha-trigo-comum', amount: 80 }, { foodId: 'bebida-amendoas', amount: 150 }, { foodId: 'maca', amount: 200 }, { foodId: 'canela', amount: 2 }]
  },
  // DIA 5
  {
    id: 'ai-dia5-pequeno-almoco', name: 'Almôndegas de ricota e espinafres (light)', description: aiDescription, category: 'Plano AI - Dia 5',
    items: [{ foodId: 'queijo-ricotta', amount: 150 }, { foodId: 'espinafre', amount: 100 }, { foodId: 'farinha-trigo-comum', amount: 30 }]
  },
  {
    id: 'ai-dia5-almoco', name: 'Madalenas salgadas com espinafres e queijo vegetal', description: aiDescription, category: 'Plano AI - Dia 5',
    items: [{ foodId: 'farinha-trigo-comum', amount: 100 }, { foodId: 'espinafre', amount: 50 }, { foodId: 'queijo-vegan-coco', amount: 40 }, { foodId: 'ovo', amount: 2 }]
  },
  {
    id: 'ai-dia5-jantar', name: 'Palitos de pescado caseiros (sem fritar)', description: aiDescription, category: 'Plano AI - Dia 5',
    items: [{ foodId: 'proteina-carne-peixe', amount: 200 }, { foodId: 'farinha-de-milho', amount: 30 }, { foodId: 'pao-ralado', amount: 15 }]
  },
  {
    id: 'ai-dia5-lanche', name: 'Batido doce com plátano, cacau e leite de aveia', description: aiDescription, category: 'Plano AI - Dia 5',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'cacau-po', amount: 5 }, { foodId: 'bebida-aveia', amount: 200 }]
  },
  // DIA 6
  {
    id: 'ai-dia6-pequeno-almoco', name: 'Barras caseiras com sementes, aveia e frutos secos', description: aiDescription, category: 'Plano AI - Dia 6',
    items: [{ foodId: 'flocos-aveia', amount: 80 }, { foodId: 'nozes', amount: 40 }, { foodId: 'sementes-chia', amount: 20 }]
  },
  {
    id: 'ai-dia6-almoco', name: 'Almôndegas de ricota e espinafres (light)', description: aiDescription, category: 'Plano AI - Dia 6',
    items: [{ foodId: 'queijo-ricotta', amount: 150 }, { foodId: 'espinafre', amount: 100 }, { foodId: 'farinha-trigo-comum', amount: 30 }]
  },
  {
    id: 'ai-dia6-jantar', name: 'Madalenas salgadas com espinafres e queijo vegetal', description: aiDescription, category: 'Plano AI - Dia 6',
    items: [{ foodId: 'farinha-trigo-comum', amount: 100 }, { foodId: 'espinafre', amount: 50 }, { foodId: 'queijo-vegan-coco', amount: 40 }, { foodId: 'ovo', amount: 2 }]
  },
  {
    id: 'ai-dia6-lanche', name: 'Batido proteico com proteínas vegetais e cacau', description: aiDescription, category: 'Plano AI - Dia 6',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'leite-sem-lactose', amount: 200 }, { foodId: 'proteina-vegetal-po', amount: 25 }, { foodId: 'cacau-po', amount: 5 }]
  },
  // DIA 7
  {
    id: 'ai-dia7-pequeno-almoco', name: 'Batido doce com plátano, cacau e leite de aveia', description: aiDescription, category: 'Plano AI - Dia 7',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'cacau-po', amount: 5 }, { foodId: 'bebida-aveia', amount: 200 }]
  },
  {
    id: 'ai-dia7-almoco', name: 'Tortitas proteicas com plátano e aveia', description: aiDescription, category: 'Plano AI - Dia 7',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'flocos-aveia', amount: 30 }, { foodId: 'ovo', amount: 1 }]
  },
  {
    id: 'ai-dia7-jantar', name: 'Bowl pós-treino com arroz, frango e abacate', description: aiDescription, category: 'Plano AI - Dia 7',
    items: [{ foodId: 'arroz-branco', amount: 60 }, { foodId: 'proteina-carne-peixe', amount: 120 }, { foodId: 'abacate', amount: 100 }]
  },
  {
    id: 'ai-dia7-lanche', name: 'Almôndegas de peru ao forno com abóbora', description: aiDescription, category: 'Plano AI - Dia 7',
    items: [{ foodId: 'proteina-carne-peixe', amount: 250 }, { foodId: 'abobora-manteiga', amount: 150 }, { foodId: 'pao-ralado', amount: 15 }]
  },
  // DIA 8
  {
    id: 'ai-dia8-pequeno-almoco', name: 'Torrada integral com abacate e ovo cozido', description: aiDescription, category: 'Plano AI - Dia 8',
    items: [{ foodId: 'pao-integral', amount: 40 }, { foodId: 'abacate', amount: 100 }, { foodId: 'ovo', amount: 1 }]
  },
  {
    id: 'ai-dia8-almoco', name: 'Sopa de cevada com lentilhas e vegetais', description: aiDescription, category: 'Plano AI - Dia 8', type: 'soup',
    items: [{ foodId: 'cevada-cozida', amount: 60 }, { foodId: 'lentilhas-vermelhas-cozidas', amount: 100 }, { foodId: 'cenoura', amount: 75 }, { foodId: 'aipo', amount: 75 }, { foodId: 'cebola', amount: 75 }]
  },
  {
    id: 'ai-dia8-jantar', name: 'Palitos de pescado caseiros (sem fritar)', description: aiDescription, category: 'Plano AI - Dia 8',
    items: [{ foodId: 'proteina-carne-peixe', amount: 200 }, { foodId: 'farinha-de-milho', amount: 30 }, { foodId: 'pao-ralado', amount: 15 }]
  },
  {
    id: 'ai-dia8-lanche', name: 'Barras caseiras com sementes, aveia e frutos secos', description: aiDescription, category: 'Plano AI - Dia 8',
    items: [{ foodId: 'flocos-aveia', amount: 80 }, { foodId: 'nozes', amount: 40 }, { foodId: 'sementes-chia', amount: 20 }]
  },
  // DIA 9
  {
    id: 'ai-dia9-pequeno-almoco', name: 'Tortitas proteicas com plátano e aveia', description: aiDescription, category: 'Plano AI - Dia 9',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'flocos-aveia', amount: 30 }, { foodId: 'ovo', amount: 1 }]
  },
  {
    id: 'ai-dia9-almoco', name: 'Massa de leguminosas com brócolos e azeite de linhaça', description: aiDescription, category: 'Plano AI - Dia 9',
    items: [{ foodId: 'massa-grao-de-bico', amount: 80 }, { foodId: 'brocolos-flor', amount: 150 }, { foodId: 'azeite-linhaca', amount: 10 }]
  },
  {
    id: 'ai-dia9-jantar', name: 'Nhoque de ricota e espinafres (light)', description: aiDescription, category: 'Plano AI - Dia 9',
    items: [{ foodId: 'queijo-ricotta', amount: 150 }, { foodId: 'espinafre', amount: 100 }, { foodId: 'farinha-trigo-comum', amount: 30 }]
  },
  {
    id: 'ai-dia9-lanche', name: 'Batido de proteínas vegetais e cacau', description: aiDescription, category: 'Plano AI - Dia 9',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'leite-sem-lactose', amount: 200 }, { foodId: 'proteina-vegetal-po', amount: 25 }, { foodId: 'cacau-po', amount: 5 }]
  },
  // DIA 10
  {
    id: 'ai-dia10-pequeno-almoco', name: 'Madalenas salgadas com espinafres e queijo vegetal', description: aiDescription, category: 'Plano AI - Dia 10',
    items: [{ foodId: 'farinha-trigo-comum', amount: 100 }, { foodId: 'espinafre', amount: 50 }, { foodId: 'queijo-vegan-coco', amount: 40 }, { foodId: 'ovo', amount: 2 }]
  },
  {
    id: 'ai-dia10-almoco', name: 'Palitos de pescado caseiros (sem fritar)', description: aiDescription, category: 'Plano AI - Dia 10',
    items: [{ foodId: 'proteina-carne-peixe', amount: 200 }, { foodId: 'farinha-de-milho', amount: 30 }, { foodId: 'pao-ralado', amount: 15 }]
  },
  {
    id: 'ai-dia10-jantar', name: 'Croquetes de vegetais ao forno', description: aiDescription, category: 'Plano AI - Dia 10',
    items: [{ foodId: 'cenoura', amount: 200 }, { foodId: 'farinha-grao-de-bico', amount: 15 }, { foodId: 'pao-ralado', amount: 15 }]
  },
  {
    id: 'ai-dia10-lanche', name: 'Batido doce com plátano, cacau e leite de aveia', description: aiDescription, category: 'Plano AI - Dia 10',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'cacau-po', amount: 5 }, { foodId: 'bebida-aveia', amount: 200 }]
  },
  // DIA 11
  {
    id: 'ai-dia11-pequeno-almoco', name: 'Almôndegas de ricota e espinafres (light)', description: aiDescription, category: 'Plano AI - Dia 11',
    items: [{ foodId: 'queijo-ricotta', amount: 150 }, { foodId: 'espinafre', amount: 100 }, { foodId: 'farinha-trigo-comum', amount: 30 }]
  },
  {
    id: 'ai-dia11-almoco', name: 'Bowl pós-treino com arroz, frango e abacate', description: aiDescription, category: 'Plano AI - Dia 11',
    items: [{ foodId: 'arroz-branco', amount: 60 }, { foodId: 'proteina-carne-peixe', amount: 120 }, { foodId: 'abacate', amount: 100 }]
  },
  {
    id: 'ai-dia11-jantar', name: 'Tortilha com ervas e batatas-doces', description: aiDescription, category: 'Plano AI - Dia 11',
    items: [{ foodId: 'ovo', amount: 2 }, { foodId: 'salsa-fresca', amount: 100 }, { foodId: 'batata-doce-laranja', amount: 100 }]
  },
  {
    id: 'ai-dia11-lanche', name: 'Barras caseiras com sementes, aveia e frutos secos', description: aiDescription, category: 'Plano AI - Dia 11',
    items: [{ foodId: 'flocos-aveia', amount: 80 }, { foodId: 'nozes', amount: 40 }, { foodId: 'sementes-chia', amount: 20 }]
  },
  // DIA 12
  {
    id: 'ai-dia12-pequeno-almoco', name: 'Batido de proteínas vegetais e cacau', description: aiDescription, category: 'Plano AI - Dia 12',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'leite-sem-lactose', amount: 200 }, { foodId: 'proteina-vegetal-po', amount: 25 }, { foodId: 'cacau-po', amount: 5 }]
  },
  {
    id: 'ai-dia12-almoco', name: 'Massa integral com ragu de lentilhas', description: aiDescription, category: 'Plano AI - Dia 12',
    items: [{ foodId: 'massa-integral-cozida', amount: 80 }, { foodId: 'lentilhas-vermelhas-cozidas', amount: 100 }, { foodId: 'cenoura', amount: 40 }, { foodId: 'polpa-de-tomate', amount: 200 }]
  },
  {
    id: 'ai-dia12-jantar', name: 'Almôndegas de peru ao forno com abóbora', description: aiDescription, category: 'Plano AI - Dia 12',
    items: [{ foodId: 'proteina-carne-peixe', amount: 250 }, { foodId: 'abobora-manteiga', amount: 150 }, { foodId: 'pao-ralado', amount: 15 }]
  },
  {
    id: 'ai-dia12-lanche', name: 'Torrada integral com abacate e ovo cozido', description: aiDescription, category: 'Plano AI - Dia 12',
    items: [{ foodId: 'pao-integral', amount: 40 }, { foodId: 'abacate', amount: 100 }, { foodId: 'ovo', amount: 1 }]
  },
  // DIA 13
  {
    id: 'ai-dia13-pequeno-almoco', name: 'Crepes integrais com creme de maçã', description: aiDescription, category: 'Plano AI - Dia 13',
    items: [{ foodId: 'farinha-trigo-comum', amount: 80 }, { foodId: 'bebida-amendoas', amount: 150 }, { foodId: 'maca', amount: 200 }, { foodId: 'canela', amount: 2 }]
  },
  {
    id: 'ai-dia13-almoco', name: 'Sopa cremosa de cenoura e batata', description: aiDescription, category: 'Plano AI - Dia 13', type: 'soup',
    items: [{ foodId: 'cenoura', amount: 200 }, { foodId: 'batata-branca-com-pele', amount: 150 }]
  },
  {
    id: 'ai-dia13-jantar', name: 'Tortitas proteicas com plátano e aveia', description: aiDescription, category: 'Plano AI - Dia 13',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'flocos-aveia', amount: 30 }, { foodId: 'ovo', amount: 1 }]
  },
  {
    id: 'ai-dia13-lanche', name: 'Madalenas salgadas com espinafres e queijo vegetal', description: aiDescription, category: 'Plano AI - Dia 13',
    items: [{ foodId: 'farinha-trigo-comum', amount: 100 }, { foodId: 'espinafre', amount: 50 }, { foodId: 'queijo-vegan-coco', amount: 40 }, { foodId: 'ovo', amount: 2 }]
  },
  // DIA 14
  {
    id: 'ai-dia14-pequeno-almoco', name: 'Torrada integral com abacate e ovo cozido', description: aiDescription, category: 'Plano AI - Dia 14',
    items: [{ foodId: 'pao-integral', amount: 40 }, { foodId: 'abacate', amount: 100 }, { foodId: 'ovo', amount: 1 }]
  },
  {
    id: 'ai-dia14-almoco', name: 'Massa de leguminosas com brócolos e azeite de linhaça', description: aiDescription, category: 'Plano AI - Dia 14',
    items: [{ foodId: 'massa-grao-de-bico', amount: 80 }, { foodId: 'brocolos-flor', amount: 150 }, { foodId: 'azeite-linhaca', amount: 10 }]
  },
  {
    id: 'ai-dia14-jantar', name: 'Barras caseiras com sementes, aveia e frutos secos', description: aiDescription, category: 'Plano AI - Dia 14',
    items: [{ foodId: 'flocos-aveia', amount: 80 }, { foodId: 'nozes', amount: 40 }, { foodId: 'sementes-chia', amount: 20 }]
  },
  {
    id: 'ai-dia14-lanche', name: 'Batido doce com plátano, cacau e leite de aveia', description: aiDescription, category: 'Plano AI - Dia 14',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'cacau-po', amount: 5 }, { foodId: 'bebida-aveia', amount: 200 }]
  },
  // DIA 15
  {
    id: 'ai-dia15-pequeno-almoco', name: 'Batido de proteínas vegetais e cacau', description: aiDescription, category: 'Plano AI - Dia 15',
    items: [{ foodId: 'banana-nao-madura', amount: 95 }, { foodId: 'leite-sem-lactose', amount: 200 }, { foodId: 'proteina-vegetal-po', amount: 25 }, { foodId: 'cacau-po', amount: 5 }]
  },
  {
    id: 'ai-dia15-almoco', name: 'Tortilha com ervas e batatas-doces', description: aiDescription, category: 'Plano AI - Dia 15',
    items: [{ foodId: 'ovo', amount: 2 }, { foodId: 'salsa-fresca', amount: 100 }, { foodId: 'batata-doce-laranja', amount: 100 }]
  },
  {
    id: 'ai-dia15-jantar', name: 'Croquetes de vegetais ao forno', description: aiDescription, category: 'Plano AI - Dia 15',
    items: [{ foodId: 'cenoura', amount: 200 }, { foodId: 'farinha-grao-de-bico', amount: 15 }, { foodId: 'pao-ralado', amount: 15 }]
  },
  {
    id: 'ai-dia15-lanche', name: 'Nhoque de ricota e espinafres (light)', description: aiDescription, category: 'Plano AI - Dia 15',
    items: [{ foodId: 'queijo-ricotta', amount: 150 }, { foodId: 'espinafre', amount: 100 }, { foodId: 'farinha-trigo-comum', amount: 30 }]
  },
];
