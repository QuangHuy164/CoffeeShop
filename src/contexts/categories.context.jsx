import { createContext, useEffect, useState } from 'react';
import {gql, useQuery} from '@apollo/client';

export const CategoriesContext = createContext({
  categoriesMap: {},
});

const COLLECTIONS = `gql
query {
  collections {
    id
    title
    items {
      id
      name
      price
      imageUrl
    }
  }
}`;

export const CategoriesProvider = ({ children }) => {
  const {loading, error, data} = useQuery(COLLECTIONS);
  const [categoriesMap, setCategoriesMap] = useState({});

  // when the data variable changes, the effect function triggers
  useEffect(() => {
    if (data) {
      const {collection} = data; // extract collection property from data
      const collectionsMap = collection.reduce((acc, collection) => {
        const {title, items} = collection
        acc[title.toLowerCase()] = items; // add title and items to acc 
        return acc;
      }, {})
      setCategoriesMap(collectionsMap)
    }
  }, [data])

  const value = { categoriesMap, loading };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
