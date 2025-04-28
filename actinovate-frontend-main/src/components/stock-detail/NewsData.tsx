
import React from 'react';

interface NewsDataProps {
  stock: any;
}

const NewsData: React.FC<NewsDataProps> = ({ stock }) => {
  if (!stock?.news?.length) return <p>No news available.</p>;

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
      <h3 className="text-xl font-bold mb-6 dark:text-white">Latest News</h3>

      <div className="space-y-4">
        {stock.news.map((article: any, idx: number) => (
          <div key={idx} className="pb-4 border-b border-gray-100 dark:border-slate-700">
            <h4 className="font-medium hover:text-blue-600 dark:text-white dark:hover:text-blue-400 cursor-pointer">
              {article.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{article.timeAgo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsData;
