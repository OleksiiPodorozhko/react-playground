import { useState } from "react";
import axios from "axios";
import "./App.css";
import SearchForm from "./components/SearchForm/SearchForm.tsx";
import type { Article } from "./types/Article.ts";
import ArticleList from "./components/ArticleList/ArticleList.tsx";
import { RotatingLines } from "react-loader-spinner";

interface ArticlesHttpResponse {
  hits: Article[];
}

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearch = async (topic: string) => {
   try {
     setIsLoading(true);
     setIsError(false);
     const response = await axios.get<ArticlesHttpResponse>(
       `https://hn.algolia.com/api/v1/search?query=${topic}`,
     );
     setArticles(response.data.hits);
   } catch {
     setIsError(true);
   } finally {
     setIsLoading(false);
   }
  };

  return (
    <>
      <SearchForm onSubmit={handleSearch} />
      {isLoading && (
        <RotatingLines
          visible={true}
          height="30"
          width="30"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      )}
      {isError && <p>Whoops, something went wrong! Please try again!</p>}
      {/*{isLoading && <p>Loading data, please wait...</p>}*/}
      {articles.length > 0 && <ArticleList items={articles} />}
    </>
  );
}