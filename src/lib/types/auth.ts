export type DataMode = "real" | "mock";

export interface AthenasUser {
  nome: string;
  usuario: string;
  codigo?: number;
  [key: string]: unknown;
}

// A spec OpenAPI da Athenas exige autenticação para ser lida, então os nomes
// exatos dos campos do corpo de /usuarios/auth não puderam ser confirmados —
// "usuario"/"senha" e o header "sub" seguem a descrição textual do endpoint
// e devem ser ajustados aqui assim que testados contra a API real.
export interface LoginCredentials {
  usuario: string;
  senha: string;
  sub: string;
}
