import pandas as pd
import numpy as np

import nltk
import re
from nltk.tokenize import TweetTokenizer
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from rake_nltk import Rake
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer


stop_words = set(stopwords.words('english'))

class ContentBased:

    def clean(self,text):
        """Remove html tags from a string"""
        clean = re.compile('<.*?>')
        text = re.sub(clean, ' ', text)
        text = re.sub('[^A-Za-z #]+', ' ', text)
        #remove space one letter space
        text = re.sub('(\s\w{1}\s)+(\w{1}\s)*',' ', text)
        #remove space tow letter space
        text = re.sub('(\s\w{2}\s)+(\w{2}\s)*',' ', text)
        #remove space # space
        text = re.sub('(\s\W{1}\s)+(\W{1}\s)*',' ',text)
        return str(text).lower()

    def stemm_stop(self, text):
        ps  = PorterStemmer()
        #stop_words = stopwords.words("english")
        stopwords = nltk.corpus.stopwords.words('english')
        newStopWords = ['num','na','#']
        stopwords.extend(newStopWords)
        filtered_words = []
        for i in text.split():
            if i not in stopwords:
                filtered_words.append(ps.stem(i))
        return " ".join(filtered_words)

    def tokenzer(self, text):
        tk = TweetTokenizer()
        return " ".join(tk.tokenize(text))

    def map_df_by_tags(self, df):
        df_new = pd.DataFrame()
        for index, row in df.iterrows():
            for tag in row['Tags'].split(" "):
                df_new = df_new.append({"Title": row["Title"], "Body": row["Body"], "Tags": tag}, ignore_index=True)
        return df_new

    # function that takes in movie title as input and returns the top 10 recommended movies
    def getTags(self, title, body):
        df = pd.read_csv("dataset/sample.csv").head(200)

        df = self.map_df_by_tags(df=df)
        df = df[["Title", "Body", "Tags"]]
        df ["Body"] = df["Body"] + df["Title"] + df["Tags"] + df["Tags"]+ df["Tags"]+ df["Tags"]+ df["Tags"]
        df['Title'] =  [str(i) for i in df.index.values] + df["Title"].values
        df = df.append({'Title': title,'Body':body,'Tags':" " , 'bag_of_words':" "},ignore_index=True)
        df.set_index('Title', inplace = True)

        # discarding the commas between the actors' full names and getting only the first three names
        df['Body'] = df['Body'].apply(self.clean).apply(self.stemm_stop).apply(self.tokenzer).apply(lambda x: x.split(' '))
        df['Tags'] = df['Tags'].apply(lambda x: x.split(' '))


        df['bag_of_words'] = ''
        columns = df.columns
        for index, row in df.iterrows():
            words = ''
            for col in columns:
                words = words + ' '.join(row[col])+ ' '
            row['bag_of_words'] = words

        df.drop(columns = [col for col in df.columns if (col not in ['bag_of_words' , 'Tags'])], inplace = True)

        # instantiating and generating the count matrix
        count = CountVectorizer()
        count_matrix = count.fit_transform(df['bag_of_words'])

        # creating a Series for the movie titles so they are associated to an ordered numerical
        # list I will use later to match the indexes
        indices = pd.Series(df.index)

        # generating the cosine similarity matrix
        cosine_sim = cosine_similarity(count_matrix, count_matrix)

        recommended_tags = []
        # gettin the index of the movie that matches the title
        l_row = indices[indices == title]
        if len(l_row) > 0:
            idx = l_row.index[0]
        else :
            return []

        # creating a Series with the similarity scores in descending order
        score_series = pd.Series(cosine_sim[idx]).sort_values(ascending = False)

        # getting the indexes of the 10 most similar movies
        top_10_indexes = list(score_series.iloc[1:20].index)

        # populating the list with the titles of the best 10 matching movies
        for i in top_10_indexes:
            for word in list(df["Tags"])[i]:
                recommended_tags.append(word)

        return list(set(recommended_tags))
