export type CreerCommandeArticleRequest = {
  articleId: string;
  quantite: number;
};

export type CreerCommandeRequest = {
  festivalierId: string;
  articles: CreerCommandeArticleRequest[];
};

export type CreerCommandeResponse = {
  commandeId: string;
  statut: string;
};
