import React, { useState, useEffect } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import wordsToNumbers from 'words-to-number';
import NewsCards from './components/NewsCards/NewsCards';
import useStyles from './styles.js';
import image from './alan.jpg';
import dotenv from 'dotenv';

dotenv.config();
const ALAN_KEY = process.env.ALAN_KEY;

const alanKey = ALAN_KEY;


function App() {
  const classes = useStyles();
  const [activeArticle, setActiveArtcile] = useState(-1);
  const [newsArticles, setNewsArticles] = useState([]);

  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, articles, number }) => {
        if(command === 'newHeadlines'){
          
          setNewsArticles(articles);
          setActiveArtcile(-1);
        }
        else if(command === 'highlight'){
          setActiveArtcile((prevActiveArticle) => prevActiveArticle + 1);  //changing state based on previous state.
        }
        else if(command === 'open'){
          const parsedNumber = number.length > 2 ? wordsToNumbers((number, { fuzzy: true })) : number;

          const article = articles[parsedNumber - 1];

          if(parsedNumber> articles.length){
            alanBtn().playText('Please try that again.')
          }
          else if(article){
            window.open(article.url, '_blank');
            alanBtn().playText('Opening...')
          }
        }
      }
    })
  }, [])

  return (
    <div>
      <div className={classes.logoContainer}>
        <img src={image} className={classes.alanLogo} alt="logo" />
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
    </div>
  );
}

export default App;
