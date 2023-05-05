// import type { APIRoute, EndpointHandler, EndpointOutput } from "astro";
// import data from "./data.json";
// import xml2js from "xml2js";

// class Producto {
//   constructor(
//     productID: string,
//     name: string,
//     camposAdicionales: CamposAdicionales
//   ) {
//     productID = productID;
//     name = name;
//     camposAdicionales = camposAdicionales;
//   }
// }
// class CamposAdicionales {
//   constructor(
//     CAT_PRINCIPAL: string,
//     TENSION_MAX: string,
//     CANT_CONDUCTORES: string,
//     SECCION_MIN: string,
//     SECCION_MAX: string
//   ) {
//     CAT_PRINCIPAL = CAT_PRINCIPAL;
//     TENSION_MAX = TENSION_MAX;
//     CANT_CONDUCTORES = CANT_CONDUCTORES;
//     SECCION_MIN = SECCION_MIN;
//     SECCION_MAX = SECCION_MAX;
//   }
// }

// export const get: APIRoute = async function get({
//   params,
//   request,
//   url,
//   generator,
//   cookies,
//   props,
//   redirect,
//   site,
// }) {
//   //levanto los datos
//   let cat_principal_value = url.searchParams.get("cat_principal");
//   let tension_max_value = url.searchParams.get("tension_max");
//   let cant_conductores_value = url.searchParams.get("cant_conductores");
//   let seccion_value = url.searchParams.get("seccion");

// };

import type { APIRoute } from "astro";
import data from "./data.json";
import xml2js from "xml2js";

class Producto {
  constructor(
    public productID: string,
    public name: string,
    public camposAdicionales: CamposAdicionales
  ) {}
}

class CamposAdicionales {
  constructor(
    public COMPONENTES_ADICIONALES: {
      PRINCIPAL_CAT: string;
      TENSION_MAX: string;
      NUMBER_CONDUCTORS: string;
      SECTION_MIN: string;
      SECTION_MAX: string;
    }
  ) {}
}

export const get: APIRoute = async function get({ url }) {
  // Obtener los parámetros de búsqueda de la URL
  let principal_cat_value = url.searchParams.get("principal_cat");
  let tension_max_value = url.searchParams.get("tension_max");
  let number_conductors_value = url.searchParams.get("number_conductors");
  let section_value = url.searchParams.get("section");

  // Crear el objeto parser y usar el método parseString para convertir el objeto XML a un objeto JavaScript
  const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });

  // Crear la lista de productos a partir de los datos del archivo data.json
  const products = await Promise.all(
    data.map(async (item: any) => {
      // Parsear los datos y esperar a que se resuelva la promesa
      const camposDeserialized = await parser.parseStringPromise(
        item.CamposAdicionales
      );
      // Crear y devolver un objeto Producto
      return new Producto(item.productID, item.Name, camposDeserialized);
    })
  );

  //filtro por condiciones
  let filterProducts = products.filter((item) => {
    if (
      item.camposAdicionales.COMPONENTES_ADICIONALES.PRINCIPAL_CAT ==
      principal_cat_value
    ) {
      if (
        item.camposAdicionales.COMPONENTES_ADICIONALES.TENSION_MAX ==
        tension_max_value
      ) {
        if (
          item.camposAdicionales.COMPONENTES_ADICIONALES.NUMBER_CONDUCTORS ==
          number_conductors_value
        ) {
          if (
            section_value &&
            item.camposAdicionales.COMPONENTES_ADICIONALES.SECTION_MAX >=
              section_value
          ) {
            if (
              section_value &&
              item.camposAdicionales.COMPONENTES_ADICIONALES.SECTION_MIN <=
                section_value
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  });
  return {
    body: JSON.stringify({
      products: filterProducts,
    }),
  };
};
