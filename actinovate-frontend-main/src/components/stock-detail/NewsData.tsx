
import React from 'react';

interface NewsArticle {
  title: string;
  timeAgo?: string;
}

interface NewsDataProps {
  stock: {
    news?: NewsArticle[];
    [key: string]: any;
  };
}

const NewsData: React.FC<NewsDataProps> = ({ stock }) => {
  const newsList = Array.isArray(stock?.news) ? stock.news : [];

  if (newsList.length === 0) return <p className="text-gray-600 dark:text-gray-300">No news available.</p>;

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
      <h3 className="text-xl font-bold mb-6 dark:text-white">Latest News</h3>

      <div className="space-y-4">
        {newsList.map((article, idx) => (
          <div key={idx} className="pb-4 border-b border-gray-100 dark:border-slate-700">
            <h4 className="font-medium hover:text-blue-600 dark:text-white dark:hover:text-blue-400 cursor-pointer">
              {article?.title || 'Untitled'}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {article?.timeAgo || 'Time not available'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsData;
