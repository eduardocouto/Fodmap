import type { MealTemplate } from '../types';

export const DETOX_RECIPES: MealTemplate[] = [
  // Smoothie Detox
  {
    id: 'detox-71',
    name: 'Batido Verde com Abacate e Espinafres',
    description: 'As gorduras monoinsaturadas do abacate reduzem a inflamação. Os espinafres são uma excelente fonte de ferro, clorofila e folato. A linhaça favorece o trânsito intestinal e nutre a flora bacteriana.',
    category: 'Smoothie Detox',
    items: [
      { foodId: 'abacate', amount: 100 },
      { foodId: 'espinafre', amount: 50 },
      { foodId: 'banana-nao-madura', amount: 80 },
      { foodId: 'bebida-amendoas', amount: 200 },
      { foodId: 'sementes-linhaca', amount: 10 },
    ],
  },
  {
    id: 'detox-72',
    name: 'Batido Roxo com Mirtilos, Banana e Sementes de Chia',
    description: 'Os mirtilos são ricos em polifenóis, que combatem o stress oxidativo. As sementes de chia fornecem ómega-3, cálcio e fibra. O plátano ajuda a repor o potássio e a serotonina.',
    category: 'Smoothie Detox',
    items: [
      { foodId: 'mirtilos', amount: 100 },
      { foodId: 'banana-nao-madura', amount: 100 },
      { foodId: 'bebida-amendoas', amount: 200 },
      { foodId: 'sementes-chia', amount: 10 },
      { foodId: 'sumo-de-limao', amount: 10 },
    ],
  },
  {
    id: 'detox-73',
    name: 'Batido Digestivo com Ananás, Funcho e Menta',
    description: 'O ananás contém bromelaína, uma enzima digestiva natural. O funcho ajuda a reduzir os gases intestinais e a menta refresca a musculatura visceral. O gengibre complementa com uma suave ação anti-inflamatória.',
    category: 'Smoothie Detox',
    items: [
      { foodId: 'ananas', amount: 150 },
      { foodId: 'funcho', amount: 80 },
      { foodId: 'menta', amount: 6 }, // Assuming 6 leaves
      { foodId: 'sumo-de-lima', amount: 10 },
      { foodId: 'gengibre', amount: 3 },
    ],
  },
  {
    id: 'detox-74',
    name: 'Smoothie Energizante com Cacau Cru e Leite de Amêndoas',
    description: 'O cacau cru é rico em magnésio e flavonoides anti-inflamatórios. As sementes de chia fornecem fibra e ómega-3.',
    category: 'Smoothie Detox',
    items: [
      { foodId: 'banana-madura', amount: 100 },
      { foodId: 'bebida-amendoas', amount: 200 },
      { foodId: 'cacau-cru-po', amount: 10 },
      { foodId: 'sementes-chia', amount: 10 },
      { foodId: 'sementes-linhaca', amount: 10 },
    ],
  },
  {
    id: 'detox-75',
    name: 'Batido Anti-inflamatório com Manga e Curcuma',
    description: 'A manga é rica em vitamina C, betacaroteno e fibra. A curcuma reduz a inflamação sistémica, e a pimenta aumenta a sua absorção. O azeite ajuda a transportar os princípios ativos lipossolúveis.',
    category: 'Smoothie Detox',
    items: [
      { foodId: 'manga', amount: 150 },
      { foodId: 'leite-coco-enlatado', amount: 200 },
      { foodId: 'curcuma-po', amount: 2 },
      { foodId: 'pimenta-preta', amount: 1 },
      { foodId: 'azeite', amount: 5 },
    ],
  },
  {
    id: 'detox-76',
    name: 'Smoothie com Beterraba e Maçã Vermelha',
    description: 'A beterraba favorece a produção de óxido nítrico, benéfico para a saúde cardiovascular. A maçã fornece fibra e pectina. O gengibre e a lima estimulam a depuração.',
    category: 'Smoothie Detox',
    items: [
      { foodId: 'beterraba-fresca', amount: 100 }, // Assuming cooked
      { foodId: 'maca', amount: 120 },
      { foodId: 'sumo-de-lima', amount: 10 },
      { foodId: 'gengibre', amount: 3 },
      { foodId: 'sementes-linhaca', amount: 10 },
    ],
  },
  {
    id: 'detox-77',
    name: 'Batido Pós-Treino com Proteína Vegetal',
    description: 'As proteínas vegetais favorecem a recuperação muscular. O cacau é antioxidante e estimulante, enquanto o plátano fornece potássio e açúcares naturais de libertação moderada.',
    category: 'Smoothie Detox',
    items: [
      { foodId: 'banana-nao-madura', amount: 100 },
      { foodId: 'proteina-vegetal-po', amount: 20 },
      { foodId: 'bebida-amendoas', amount: 200 },
      { foodId: 'cacau-cru-po', amount: 5 },
      { foodId: 'canela', amount: 2 },
    ],
  },
  {
    id: 'detox-78',
    name: 'Batido Alcalinizante com Pepino e Lima',
    description: 'O pepino e a lima ajudam a drenar líquidos e a neutralizar o excesso de ácidos. Os espinafres fornecem clorofila e ferro, enquanto as sementes de chia promovem o trânsito intestinal.',
    category: 'Smoothie Detox',
    items: [
      { foodId: 'pepino-continental', amount: 200 },
      { foodId: 'maca', amount: 80 },
      { foodId: 'sumo-de-lima', amount: 20 },
      { foodId: 'espinafre', amount: 30 },
      { foodId: 'sementes-chia', amount: 10 },
    ],
  },
  {
    id: 'detox-79',
    name: 'Batido de Chá Matcha e Banana',
    description: 'O chá matcha contém L-teanina, um aminoácido que favorece a calma e a clareza mental. O plátano fornece energia, enquanto a bebida vegetal aporta proteínas leves e digeríveis.',
    category: 'Smoothie Detox',
    items: [
      { foodId: 'banana-nao-madura', amount: 100 },
      { foodId: 'cha-matcha-po', amount: 2 },
      { foodId: 'bebida-arroz', amount: 200 },
      { foodId: 'xarope-agave', amount: 5 },
      { foodId: 'baunilha-natural', amount: 1 },
    ],
  },
  {
    id: 'detox-80',
    name: 'Batido Cremoso com Abóbora e Canela',
    description: 'A abóbora é rica em betacarotenos e fibra solúvel, ideal para a saúde intestinal. A canela regula o açúcar no sangue e tem propriedades antioxidantes, enquanto a linhaça fornece ómega-3.',
    category: 'Smoothie Detox',
    items: [
      { foodId: 'abobora-manteiga', amount: 100 }, // Assuming cooked
      { foodId: 'banana-nao-madura', amount: 100 },
      { foodId: 'bebida-aveia', amount: 200 },
      { foodId: 'canela', amount: 2 },
      { foodId: 'sementes-linhaca', amount: 10 },
    ],
  },
  // Zumos Antioxidantes
  {
    id: 'detox-81',
    name: 'Zumo de Cenoura, Maçã e Gengibre',
    description: 'As cenouras são ricas em betacaroteno. A maçã regula os intestinos e ajuda a combater a inflamação. O gengibre melhora a digestão e estimula o metabolismo.',
    category: 'Zumos Antioxidantes',
    items: [
      { foodId: 'cenoura', amount: 160 },
      { foodId: 'maca', amount: 120 },
      { foodId: 'gengibre', amount: 4 },
    ],
  },
  {
    id: 'detox-82',
    name: 'Zumo de Pepino, Aipo e Limão',
    description: 'O pepino e o aipo são muito hidratantes e diuréticos. O limão melhora a função hepática e ajuda a manter um pH interno equilibrado.',
    category: 'Zumos Antioxidantes',
    items: [
      { foodId: 'pepino-continental', amount: 200 },
      { foodId: 'aipo', amount: 100 },
      { foodId: 'sumo-de-limao', amount: 20 },
    ],
  },
  {
    id: 'detox-83',
    name: 'Zumo de Beterraba, Laranja e Curcuma',
    description: 'A beterraba é rica em nitratos naturais e favorece a circulação. A laranja fornece vitamina C, enquanto a curcuma, potenciada pela pimenta, reduz a inflamação.',
    category: 'Zumos Antioxidantes',
    items: [
      { foodId: 'beterraba-fresca', amount: 100 },
      { foodId: 'sumo-laranja-natural', amount: 150 },
      { foodId: 'curcuma-po', amount: 2 },
      { foodId: 'pimenta-preta', amount: 1 },
    ],
  },
  {
    id: 'detox-84',
    name: 'Zumo de Ananás, Funcho e Menta',
    description: 'O ananás contém bromelaína, uma enzima digestiva natural. O funcho tem uma ação carminativa que ajuda na digestão.',
    category: 'Zumos Antioxidantes',
    items: [
      { foodId: 'ananas', amount: 150 },
      { foodId: 'funcho', amount: 80 },
      { foodId: 'menta', amount: 6 },
    ],
  },
  {
    id: 'detox-85',
    name: 'Zumo de Espinafres, Pera e Lima',
    description: 'Os espinafres são ricos em vitamina K e ferro, a pera melhora o trânsito intestinal e ajuda na absorção de ferro. A lima tem um efeito alcalinizante.',
    category: 'Zumos Antioxidantes',
    items: [
      { foodId: 'espinafre', amount: 50 },
      { foodId: 'pera', amount: 120 },
      { foodId: 'sumo-de-lima', amount: 15 },
    ],
  },
  {
    id: 'detox-86',
    name: 'Zumo de Couve Roxa, Maçã Verde e Gengibre',
    description: 'A couve roxa é rica em antioxidantes. A maçã verde regula a digestão, e o gengibre ativa a circulação, reduzindo a inflamação.',
    category: 'Zumos Antioxidantes',
    items: [
      { foodId: 'couve-roxa', amount: 50 },
      { foodId: 'maca', amount: 120 }, // Assuming maçã verde is same as maçã
      { foodId: 'gengibre', amount: 4 },
    ],
  },
  {
    id: 'detox-87',
    name: 'Zumo de Toranja Rosa, Pepino e Salsa',
    description: 'A toranja rosa é diurética e depurativa. O pepino hidrata em profundidade, e a salsa é rica em vitamina C e clorofila, com efeito detox e alcalinizante.',
    category: 'Zumos Antioxidantes',
    items: [
      { foodId: 'toranja', amount: 150 },
      { foodId: 'pepino-continental', amount: 100 },
      { foodId: 'salsa-fresca', amount: 10 },
    ],
  },
  {
    id: 'detox-88',
    name: 'Zumo de Kiwi, Maçã e Manjericão',
    description: 'O kiwi é rico em vitamina C e fibra, a maçã regula o trânsito intestinal e o manjericão favorece o sistema imunitário e o bem-estar geral.',
    category: 'Zumos Antioxidantes',
    items: [
      { foodId: 'kiwi', amount: 140 },
      { foodId: 'maca', amount: 100 },
      { foodId: 'manjericao-fresco', amount: 4 },
    ],
  },
  {
    id: 'detox-89',
    name: 'Batido de Romãs e Morangos',
    description: 'A romã é rica em polifenóis e vitamina C, úteis contra o envelhecimento celular. Os morangos são diuréticos e ajudam a combater os radicais livres.',
    category: 'Zumos Antioxidantes', // Classified as Zumo in the source
    items: [
      { foodId: 'roma', amount: 100 },
      { foodId: 'morangos', amount: 150 },
      { foodId: 'sumo-de-limao', amount: 15 },
    ],
  },
  {
    id: 'detox-90',
    name: 'Zumo de Manga, Cenoura e Limão',
    description: 'A manga é fonte de vitamina A e betacaroteno, a cenoura favorece a vista e uma pele saudável, e o limão estimula o fígado e complementa o seu efeito alcalinizante.',
    category: 'Zumos Antioxidantes',
    items: [
      { foodId: 'manga', amount: 100 },
      { foodId: 'cenoura', amount: 160 },
      { foodId: 'sumo-de-limao', amount: 15 },
    ],
  },
];
