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