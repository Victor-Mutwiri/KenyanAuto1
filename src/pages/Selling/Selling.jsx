import { Link } from 'react-router-dom';
import sellingGuide from './Selling.json'

import './Selling.css';

export const Selling = () => {
  return (
    <div>
      {sellingGuide.map((article) => (
        <Link to={`/selling-guide/${article.route}`} key={article.id} className="card-link">
          <div className="card" style={{ width: '18rem' }}>
            <img src={article.img} className="card-img-top" alt={article.title}/>
            <div className="card-body">
              <h4 className="card-title">{article.title}</h4>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
