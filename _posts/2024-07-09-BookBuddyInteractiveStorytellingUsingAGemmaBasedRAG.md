---
layout: post
type: blog
title: Book Buddy - Interactive Storytelling using a Gemma-based RAG 📖
comments: true
mathjax: true
---

<figure class="wp-block-image size-large"><a href="https://jigyasagrover.wordpress.com/wp-content/uploads/2024/07/book-buddy.png"><img src="https://jigyasagrover.wordpress.com/wp-content/uploads/2024/07/book-buddy.png?w=1024" alt="" class="wp-image-3420"/></a></figure>

<p>In the realm of AI-driven interactive storytelling, the fusion of Retrieval Augmented Generation (RAG) and Google's Gemma language model opens new avenues for creating engaging narratives and educational experiences. RAG, often likened to an "open-book" approach for AI, empowers models like Gemma to access and synthesize vast amounts of information to answer specific queries or weave intricate tales.</p>

<h2 class="wp-block-heading">RAG and Gemma 🤝🏻</h2>

<p><a href="https://cloud.google.com/use-cases/retrieval-augmented-generation">Retrieval-Augmented Generation (RAG)</a> leverages a dual-model approach: a retriever to fetch relevant information and a generator to craft responses in natural language. This method not only enhances the accuracy of AI-generated content but also reduces computational overhead compared to traditional fine-tuning methods.</p>

<p><a href="https://ai.google.dev/gemma">Gemma</a>, a lightweight, text-to-text, decoder-only large language model, is known for its precision and efficiency, emerges as an ideal candidate for such tasks, making it a potent tool for interactive storytelling.</p>

<figure class="wp-block-image"><img src="https://github.com/jigyasa-grover/Book-Buddy-Interactive-Storytelling-using-a-Gemma-based-RAG-/assets/9291400/6a281de4-b369-415c-839e-63c48f3422df" alt="image"/></figure>

<p><em><a href="https://arxiv.org/pdf/2402.19473">A generic RAG architecture, courtesy (arxiv) 'Retrieval-Augmented Generation for AI-Generated Content: A Survey'</a></em>.</p>

<h2 class="wp-block-heading">Crafting Interactive Narratives 🏰</h2>

<p>Imagine a scenario where readers can interact with a virtual "Book Buddy," a character powered by Gemma-based RAG. This AI companion can dynamically respond to queries from the storylines and provide detailed explanations on demand. Whether guiding readers through complex plotlines or explaining background lore, Gemma excels in delivering coherent, engaging content tailored to user interactions.</p>

<h1 class="wp-block-heading"><strong>Let's Build "Book Buddy" 🛠️</strong></h1>

<p>To delve deeper into the capabilities of Gemma-based RAG for interactive storytelling, let's embark on a hands-on journey that creates a dynamic system capable of answering questions about the classic text <a href="https://www.gutenberg.org/files/11/11-0.txt">"Alice's Adventures in Wonderland" by Lewis Carroll</a>, available from Project Gutenberg.</p>

<p>By leveraging Gemma's capabilities, we can prototype interactive narratives that respond intelligently to user prompts, offering a personalized storytelling experience. Whether deployed in educational settings to elucidate historical events or within gaming environments to create dynamic quests, the versatility of Gemma-based RAG enriches the user experience through immersive, responsive storytelling.</p>

<h2 class="wp-block-heading">Setting up the environment 🌳</h2>

<p>Installing the packages in an order that minimizes potential dependency conflicts and ensures smooth installation.</p>

```
## Torch and Related Libraries (torch, torchvision, torchaudio).
!pip install -q torch torchvision torchaudio

## Transformers and Related Libraries (transformers, huggingface_hub).
!pip install -q transformers huggingface_hub

## Sentence Transformers: Easy method to compute dense vector representations 
## for sentences, paragraphs, and images.
!pip install -q sentence-transformers

## Gradio: Open-source Python package that allows you to quickly build a demo 
## or web applications.
!pip install -q gradio

## Accelerate: Abstracts exactly and only the boilerplate code related to 
## multi-GPUs/TPU/fp16 and leaves the rest of your code unchanged.
!pip install -q accelerate

## chromadb: The open-source embedding database. The fastest way to build Python
## or JavaScript LLM apps with memory.
!pip install -q chromadb

## Langchain: Framework for developing applications powered by LLMs.  
## Langchain Community contains all third party integrations. 
!pip install -q langchain langchain_community

## Bits And Bytes: Lightweight Python wrapper around CUDA custom functions.
!pip install -q bitsandbytes
```

<p>Importing the necessary libraries and modules.</p>

```
## Standard Library Imports.
import os
from typing import Tuple, List

## Third-Party Library Imports.
import gradio as gr

## Google Colab Specific Imports.
from google.colab import userdata

## Local Application/Library Specific Imports.
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain.chains import ConversationalRetrievalChain
from langchain_community.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from langchain_community.llms import HuggingFaceEndpoint
```

<p>Setting environment variables for the user agent and Hugging Face Hub API token. These ensure that all web requests are identified as originating from the <em>"book_buddy/1.0"</em> user agent and authorize the use of Hugging Face's API.</p>

```
os.environ['USER_AGENT'] = 'book_buddy/1.0'
os.environ['HUGGINGFACEHUB_API_TOKEN'] = userdata.get('HUGGINGFACEHUB_API_TOKEN')
```

<h2 class="wp-block-heading">Loading and splitting the data 📚</h2>

<p>Specifying the document source and defining other parameters like <em>chunk_size</em> and <em>chunk_overlap</em> for splitting the text into manageable chunks. Here we use the URL for <a href="https://www.gutenberg.org/files/11/11-0.txt">Project Gutenberg's book text for "Alice’s Adventures in Wonderland by Lewis Carroll"</a>.</p>

```
BOOK_TEXT_WEB_SOURCE = "https://www.gutenberg.org/files/11/11-0.txt"
TEXT_SPLITTER_CHUNK_SIZE = 1000
TEXT_SPLITTER_CHUNK_OVERLAP = 200
```

<p>The LangChain's <a href="https://python.langchain.com/v0.2/docs/integrations/document_loaders/web_base/">WebBaseLoader</a> is utilized to load the text from the specified URL.</p>

book_data_loader = WebBaseLoader(BOOK_TEXT_WEB_SOURCE)
book_data = book_data_loader.load()

<p>The objective of splitting the data is to partition lengthy text documents into smaller, more digestible segments or chunks. This practice enhances efficiency in NLP tasks, addressing constraints that models may encounter with processing extensive amounts of text in a single instance. Here we use the <a href="https://api.python.langchain.com/en/latest/character/langchain_text_splitters.character.RecursiveCharacterTextSplitter.html">RecursiveCharacterTextSplitter</a>  to split the document into chunks of <em>TEXT_SPLITTER_CHUNK_SIZE</em> characters, with an overlap of <em>TEXT_SPLITTER_CHUNK_OVERLAP</em> characters to maintain context across chunks.</p>

```
recursive_character_text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = text_splitter_chunk_size, 
        chunk_overlap = text_splitter_chunk_overlap
)
recursive_character_text_splits = recursive_character_text_splitter.split_documents(book_data)
```

<h2 class="wp-block-heading">Loading the embedding model 🤳🏻</h2>

<p>The next step involves converting textual data into numerical vectors (embeddings) for the text chunks using the <em>SENTENCE_TRANSFORMER_EMBEDDINGS_MODEL</em>. Here we use <a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2</a> which maps sentences and paragraphs to a 384-dimensional dense vector space and can</p>

```
SENTENCE_TRANSFORMER_EMBEDDINGS_MODEL = "all-MiniLM-L6-v2"

sentence_transformer_embeddings = SentenceTransformerEmbeddings(
          model_name = SENTENCE_TRANSFORMER_EMBEDDINGS_MODEL
      )
```

<h2 class="wp-block-heading">Storing the embeddings in a vector database 🧳</h2>

<p>These embeddings are now stored in a specialized / vector database (<a href="https://www.trychroma.com/">Chroma</a>) optimized for fast searches and similarity comparisons.</p>

```
chroma_vector_db = Chroma.from_documents(
          documents = recursive_character_text_splits, 
          embedding = sentence_transformer_embeddings
 )
```

<h2 class="wp-block-heading">Setting up the retriever 🔬</h2>

<p>Setting up a retrieval mechanism to query the previously created vector database using <em>RETREIVER_SEARCH_TYPE</em> and <em>RETREIVER_SEARCH_K</em> configuration to ensure diverse and relevant results. The retriever is designed to locate text chunks that exhibit semantic similarity to a specified query. Here we use MMR = Maximal Marginal Relevance (MMR) as the search type for our retriever since it considers the similarity of keywords/keyphrases with the document, along with the similarity of already selected keywords and keyphrases. This results in a selection that maximizes the diversity with respect to the document.</p>

```
RETREIVER_SEARCH_TYPE = "mmr"
RETREIVER_SEARCH_K = 2

retriever = chroma_vector_db.as_retriever(
          search_type = retriever_search_type, 
          search_kwargs={"k": retriever_search_k}
 )
```

<h2 class="wp-block-heading">Setting up the generator 🎡</h2>

<p>The generator here leverages advanced language modeling techniques to generate human-like answers, enhancing the user experience. Here the language model used for generating responses is <a href="https://ai.google.dev/gemma">Gemma</a> by Google.</p>

```
GENERATOR_HUGGINGFACEHUB_REPO_ID = "google/gemma-1.1-2b-it"
GENERATOR_MAX_LENGTH = 1024
GENERATOR_TEMPERATURE = 0.1

large_language_model = HuggingFaceEndpoint(
          repo_id = GENERATOR_HUGGINGFACEHUB_REPO_ID, 
          max_length = GENERATOR_MAX_LENGTH, 
          temperature = GENERATOR_TEMPERATURE
)
```

<h2 class="wp-block-heading">Setting up the conversational retrieval chain ⛓️</h2>

<p>The core of the interactive storytelling application is the <a href="https://api.python.langchain.com/en/latest/chains/langchain.chains.conversational_retrieval.base.ConversationalRetrievalChain.html">ConversationalRetrievalChain</a>, which ties together the language model and the retriever. This chain is designed to locate pertinent information, with the language model, engineered to generate coherent text. Together, they form a unified and robust component. This integration facilitates a seamless and intuitive question-and-answer interaction for users. In short, this chain allows the system to process user queries, retrieve relevant text chunks, and generate coherent answers.</p>

```
conversational_retrieval_chain = ConversationalRetrievalChain.from_llm(
          llm = large_language_model, 
          retriever = retriever
)
```

<h2 class="wp-block-heading">Asking "Book Buddy" a question 🙋🏻‍♀️</h2>

<p>The response from the conversational retrieval chain contains chat history, the question asked, and the answer.</p>

```
response = self.conversational_retrieval_chain.invoke({
            "question": question, 
            "chat_history": chat_history
})
```

<h2 class="wp-block-heading">Tying it all in 🎀</h2>

```
# Specifying the source document and defining other parameters like chunk_size
# and chunk_overlap for splitting the text into manageable chunks.

# This is the URL for Project Gutenberg's book text for "Alice’s Adventures in
# Wonderland by Lewis Carroll"
BOOK_TEXT_WEB_SOURCE = "https://www.gutenberg.org/files/11/11-0.txt"
TEXT_SPLITTER_CHUNK_SIZE = 1000
TEXT_SPLITTER_CHUNK_OVERLAP = 200

# all-MiniLM-L6-v2: https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
# It maps sentences & paragraphs to a 384 dimensional dense vector space and can
# be used for tasks like clustering or semantic search.
SENTENCE_TRANSFORMER_EMBEDDINGS_MODEL = "all-MiniLM-L6-v2"

# MMR = Maximal Marginal Relevance (MMR).
# MMR considers the similarity of keywords/keyphrases with the document, along
# with the similarity of already selected keywords and keyphrases.
# This results in a selection that maximizes the diversity wrt the document.
# https://github.com/langchain-ai/langchain/issues/11815
RETREIVER_SEARCH_TYPE = "mmr"
RETREIVER_SEARCH_K = 2

# The language model used for generating responses is Gemma by Google.
GENERATOR_HUGGINGFACEHUB_REPO_ID = "google/gemma-1.1-2b-it"
GENERATOR_MAX_LENGTH = 1024
GENERATOR_TEMPERATURE = 0.1

class BookBuddy:

    chat_history:  List[Tuple[str, str]] = []
    conversational_retrieval_chain = None

    def __init__(
        self, 
        book_text_web_source: str = BOOK_TEXT_WEB_SOURCE,
        text_splitter_chunk_size: int = TEXT_SPLITTER_CHUNK_SIZE, 
        text_splitter_chunk_overlap: int = TEXT_SPLITTER_CHUNK_OVERLAP,
        sentence_transformer_embeddings_model: str = SENTENCE_TRANSFORMER_EMBEDDINGS_MODEL,
        retriever_search_type: str = RETREIVER_SEARCH_TYPE, 
        retriever_search_k: int = RETREIVER_SEARCH_K,
        generator_huggingfacehub_repo_id: str = GENERATOR_HUGGINGFACEHUB_REPO_ID,
        generator_max_length: int = GENERATOR_MAX_LENGTH,
        generator_temperature: float = GENERATOR_TEMPERATURE,
        is_verbose: bool = True
    ):

      # ------------------------------------------------------------------------
      if is_verbose:
        print("\n\n" + "="*50 + "\nLoading the data...\n" + "="*50)
      
      # The WebBaseLoader is utilized to load the text from the specified URL.
      book_data_loader = WebBaseLoader(book_text_web_source)
      book_data = book_data_loader.load()
      
      if is_verbose:
        # Taking a sneak peek at the data...
        print("[test] number of documents: ", len(book_data))
        print("[test] length of first document: ", len(book_data[0].page_content))
        print("[test] book_data[0].page_content[:500]: ", book_data[0].page_content[:500])
      
      # ------------------------------------------------------------------------

      # The objective is to partition lengthy text documents into smaller, more
      # digestible segments or chunks. This practice enhances efficiency in 
      # NLP tasks, addressing constraints that models may encounter with 
      # processing extensive amounts of text in a single instance.
      
      if is_verbose:
        print("\n\n" + "="*50 + "\nSplitting the data...\n" + "="*50)
      
      # Here we use the RecursiveCharacterTextSplitter to split the document 
      # into chunks of text_splitter_chunk_size characters, with an overlap of 
      # text_splitter_chunk_overlap characters to maintain context  across chunks.
      recursive_character_text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = text_splitter_chunk_size, 
        chunk_overlap = text_splitter_chunk_overlap
      )
      recursive_character_text_splits = recursive_character_text_splitter.split_documents(book_data)
      if is_verbose:
        # Taking a sneak peek at the text splits...
        print("[test] number of chunks: ", len(recursive_character_text_splits))
        print("[test] length of first chunk: ", len(recursive_character_text_splits[0].page_content))
        print("[test] average length of chunks: ", 
              sum(len(chunk.page_content) for chunk in recursive_character_text_splits) 
              / len(recursive_character_text_splits)
        )
        print("[test] recursive_character_text_splits[0].page_content[:500]: ", 
              recursive_character_text_splits[0].page_content[:500])
      
      # ------------------------------------------------------------------------

      # The next step involves converting textual data into numerical vectors
      # (embeddings) for the text chunks using the sentence_transformer_embeddings_model.

      if is_verbose:
        print("\n\n" + "="*50 + "\nLoading the embeddings model...\n" + "="*50)
      sentence_transformer_embeddings = SentenceTransformerEmbeddings(
          model_name = sentence_transformer_embeddings_model
      )
      if is_verbose:
        # Taking a sneak peek at the sentence transformer embeddings model config...
        print(sentence_transformer_embeddings)

      # ------------------------------------------------------------------------

      # These embeddings are now stored in a specialized / vector database 
      # (Chroma) optimized for fast searches and similarity comparisons.

      if is_verbose:
        print("\n\n" + "="*50 + "\nStoring the embeddings in a vector database...\n" + "="*50)
      chroma_vector_db = Chroma.from_documents(
          documents = recursive_character_text_splits, 
          embedding = sentence_transformer_embeddings
      )
      if is_verbose:
        # Taking a sneak peek at the sentence transformer embeddings model config...
        print(chroma_vector_db)

      # ------------------------------------------------------------------------

      # Setting up a retrieval mechanism to query the previously created vector 
      # database using retriever_search_type and retriever_search_k configuration
      # to ensure diverse and relevant results. The retriever is designed to 
      # locate text chunks that exhibit semantic similarity to a specified query. 
      
      if is_verbose:
        print("\n\n" + "="*50 + "\nSetting up the retriever...\n" + "="*50)
      retriever = chroma_vector_db.as_retriever(
          search_type = retriever_search_type, 
          search_kwargs={"k": retriever_search_k}
      )
      if is_verbose:
        # Taking a sneak peek at the retriever config...
        print(retriever)

      # ------------------------------------------------------------------------

      # The generator here leverages advanced language modeling techniques to 
      # generate human-like answers, enhancing the user experience.

      if is_verbose:
        print("\n\n" + "="*50 + "\nSetting up the generator...\n" + "="*50)
      large_language_model = HuggingFaceEndpoint(
          repo_id = generator_huggingfacehub_repo_id, 
          max_length = generator_max_length, 
          temperature = generator_temperature
      )
      if is_verbose:
        # Taking a sneak peek at the large language model...
        print("large_language_model: ", large_language_model)

      # ------------------------------------------------------------------------

      # The core of the interactive storytelling application is the 
      # ConversationalRetrievalChain, which ties together the language model and
      # the retriever. This chain is designed to locate pertinent information, 
      # with the language model, engineered to generate coherent text. Together,
      # they form a unified and robust component. This integration facilitates a
      # seamless and intuitive question-and-answer interaction for users.

      if is_verbose:
        print("\n\n" + "="*50 + "\nSetting up the conversational retrieval chain...\n" + "="*50)

      # In short, this chain allows the system to process user queries, retrieve
      # relevant text chunks, and generate coherent answers.
      self.conversational_retrieval_chain = ConversationalRetrievalChain.from_llm(
          llm = large_language_model, 
          retriever = retriever
      )
      if is_verbose:
        # Taking a sneak peek at the conversational retrieval chain config...
        print(self.conversational_retrieval_chain)
      
      # ------------------------------------------------------------------------

      if is_verbose:
        print("\n\n" + "="*50 + "\nBookBuddy is ready to go!\n" + "="*50)
      

    def ask_question(
        self, 
        question: str, 
        chat_history:  List[Tuple[str, str]] = []
    ) -> Tuple[str, List[Tuple[str, str]]]:
        response = self.conversational_retrieval_chain.invoke({
            "question": question, 
            "chat_history": chat_history
        })
        chat_history.append((question, response["answer"]))
        # The response contains chat history, question, and the answer.
        return response["answer"], chat_history
```

<h2 class="wp-block-heading"><strong>Testing BookBuddy</strong> 🧪</h2>

```
my_book_buddy = BookBuddy()
```

```
==================================================
Loading the embeddings model...
==================================================
/usr/local/lib/python3.10/dist-packages/langchain_core/_api/deprecation.py:139: LangChainDeprecationWarning: The class `HuggingFaceEmbeddings` was deprecated in LangChain 0.2.2 and will be removed in 0.3.0. An updated version of the class exists in the langchain-huggingface package and should be used instead. To use it run `pip install -U langchain-huggingface` and import as `from langchain_huggingface import HuggingFaceEmbeddings`.
  warn_deprecated(
/usr/local/lib/python3.10/dist-packages/huggingface_hub/utils/_token.py:89: UserWarning: 
The secret `HF_TOKEN` does not exist in your Colab secrets.
To authenticate with the Hugging Face Hub, create a token in your settings tab (https://huggingface.co/settings/tokens), set it as secret in your Google Colab and restart your session.
You will be able to reuse this secret in all of your notebooks.
Please note that authentication is recommended but still optional to access public models or datasets.
  warnings.warn(
/usr/local/lib/python3.10/dist-packages/huggingface_hub/file_download.py:1132: FutureWarning: `resume_download` is deprecated and will be removed in version 1.0.0. Downloads always resume when possible. If you want to force a new download, use `force_download=True`.
  warnings.warn(
client=SentenceTransformer(
  (0): Transformer({'max_seq_length': 256, 'do_lower_case': False}) with Transformer model: BertModel 
  (1): Pooling({'word_embedding_dimension': 384, 'pooling_mode_cls_token': False, 'pooling_mode_mean_tokens': True, 'pooling_mode_max_tokens': False, 'pooling_mode_mean_sqrt_len_tokens': False, 'pooling_mode_weightedmean_tokens': False, 'pooling_mode_lasttoken': False, 'include_prompt': True})
  (2): Normalize()
) model_name='all-MiniLM-L6-v2' cache_folder=None model_kwargs={} encode_kwargs={} multi_process=False show_progress=False


==================================================
Storing the embeddings in a vector database...
==================================================
/usr/local/lib/python3.10/dist-packages/langchain_core/_api/deprecation.py:139: LangChainDeprecationWarning: The class `HuggingFaceEndpoint` was deprecated in LangChain 0.0.37 and will be removed in 0.3. An updated version of the class exists in the langchain-huggingface package and should be used instead. To use it run `pip install -U langchain-huggingface` and import as `from langchain_huggingface import HuggingFaceEndpoint`.
  warn_deprecated(
WARNING:langchain_community.llms.huggingface_endpoint:WARNING! max_length is not default parameter.
                    max_length was transferred to model_kwargs.
                    Please make sure that max_length is what you intended.
<langchain_community.vectorstores.chroma.Chroma object at 0x788dc40c6cb0>


==================================================
Setting up the retriever...
==================================================
tags=['Chroma', 'HuggingFaceEmbeddings'] vectorstore=<langchain_community.vectorstores.chroma.Chroma object at 0x788dc40c6cb0> search_type='mmr' search_kwargs={'k': 2}


==================================================
Setting up the generator...
==================================================
The token has not been saved to the git credentials helper. Pass `add_to_git_credential=True` in this function directly or `--add-to-git-credential` if using via `huggingface-cli` if you want to set the git credential as well.
Token is valid (permission: fineGrained).
Your token has been saved to /root/.cache/huggingface/token
Login successful
large_language_model:  HuggingFaceEndpoint
Params: {'endpoint_url': None, 'task': None, 'model_kwargs': {'max_length': 1024}}


==================================================
Setting up the conversational retrieval chain...
==================================================
combine_docs_chain=StuffDocumentsChain(llm_chain=LLMChain(prompt=PromptTemplate(input_variables=['context', 'question'], template="Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\nQuestion: {question}\nHelpful Answer:"), llm=HuggingFaceEndpoint(repo_id='google/gemma-1.1-2b-it', temperature=0.1, model_kwargs={'max_length': 1024}, model='google/gemma-1.1-2b-it', client=<InferenceClient(model='google/gemma-1.1-2b-it', timeout=120)>, async_client=<InferenceClient(model='google/gemma-1.1-2b-it', timeout=120)>)), document_variable_name='context') question_generator=LLMChain(prompt=PromptTemplate(input_variables=['chat_history', 'question'], template='Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.\n\nChat History:\n{chat_history}\nFollow Up Input: {question}\nStandalone question:'), llm=HuggingFaceEndpoint(repo_id='google/gemma-1.1-2b-it', temperature=0.1, model_kwargs={'max_length': 1024}, model='google/gemma-1.1-2b-it', client=<InferenceClient(model='google/gemma-1.1-2b-it', timeout=120)>, async_client=<InferenceClient(model='google/gemma-1.1-2b-it', timeout=120)>)) retriever=VectorStoreRetriever(tags=['Chroma', 'HuggingFaceEmbeddings'], vectorstore=<langchain_community.vectorstores.chroma.Chroma object at 0x788dc40c6cb0>, search_type='mmr', search_kwargs={'k': 2})


==================================================
BookBuddy is ready to go!
==================================================
```

```
test_questions = [
    "Who has written Alice’s Adventures in Wonderland?",
    "What game does Alice play?",
    "Who said - Off with their heads?",
    "Where was the cat from?",
    "What was the last part of the cat to disappear?",
    "What is written on the potion bottle that Alice drinks?",
    "Who fell asleep at the Tea Party?",
    "What is rule 42 and why is it important for Alice?",
    "From what is the Caterpillar in Alice’s Adventures in Wonderland smoking?",
    "Which character serves as herald to the King and Queen of Hearts?"
]

chat_history = []

for test_question in test_questions:
    answer, chat_history = my_book_buddy.ask_question(test_question, chat_history)
    print("\nQuestion: ", test_question)
    print("Answer: ", answer)
    print("Current Chat History: ", chat_history)
```

<h3 class="wp-block-heading">Here are the results 🎉</h3>

```
Question:  Who has written Alice’s Adventures in Wonderland?
Answer:   Lewis Carroll.

Current Chat History:  [('Who has written Alice’s Adventures in Wonderland?', ' Lewis Carroll.')]

Question:  What game does Alice play?
Answer:   Alice plays a game of croquet in Wonderland.

Current Chat History:  [('Who has written Alice’s Adventures in Wonderland?', ' Lewis Carroll.'), ('What game does Alice play?', ' Alice plays a game of croquet in Wonderland.')]

Question:  Who said - Off with their heads?
Answer:   The Queen of Hearts said "Off with their heads".

Current Chat History:  [('Who has written Alice’s Adventures in Wonderland?', ' Lewis Carroll.'), ('What game does Alice play?', ' Alice plays a game of croquet in Wonderland.'), ('Who said - Off with their heads?', ' The Queen of Hearts said "Off with their heads".')]

Question:  What was the last part of the cat to disappear?
Answer:   The grin.

Current Chat History:  [('Who has written Alice’s Adventures in Wonderland?', ' Lewis Carroll.'), ('What game does Alice play?', ' Alice plays a game of croquet in Wonderland.'), ('Who said - Off with their heads?', ' The Queen of Hearts said "Off with their heads".'), ('What was the last part of the cat to disappear?', ' The grin.')]

Question:  What is written on the potion bottle that Alice drinks?
Answer:   The potion bottle says "Drink me."

Current Chat History:  [('Who has written Alice’s Adventures in Wonderland?', ' Lewis Carroll.'), ('What game does Alice play?', ' Alice plays a game of croquet in Wonderland.'), ('Who said - Off with their heads?', ' The Queen of Hearts said "Off with their heads".'), ('What was the last part of the cat to disappear?', ' The grin.'), ('What is written on the potion bottle that Alice drinks?', ' The potion bottle says "Drink me."')]

Question:  Who fell asleep at the Tea Party?
Answer: The person who fell asleep at the Tea Party is the Dormouse.

Current Chat History:  [('Who has written Alice’s Adventures in Wonderland?', ' Lewis Carroll.'), ('What game does Alice play?', ' Alice plays a game of croquet in Wonderland.'), ('Who said - Off with their heads?', ' The Queen of Hearts said "Off with their heads".'), ('What was the last part of the cat to disappear?', ' The grin.'), ('What is written on the potion bottle that Alice drinks?', ' The potion bottle says "Drink me."'), ('Who fell asleep at the Tea Party?', 'The person who fell asleep at the Tea Party is the Dormouse.')]

Question:  What is rule 42 and why is it important for Alice?
Answer:   Rule 42 is the oldest rule in the book and it dictates that all persons more than a mile high must leave the court. This impacts Alice because she is not a mile high and therefore must leave the court.

Current Chat History:  [('Who has written Alice’s Adventures in Wonderland?', ' Lewis Carroll.'), ('What game does Alice play?', ' Alice plays a game of croquet in Wonderland.'), ('Who said - Off with their heads?', ' The Queen of Hearts said "Off with their heads".'), ('What was the last part of the cat to disappear?', ' The grin.'), ('What is written on the potion bottle that Alice drinks?', ' The potion bottle says "Drink me."'), ('Who fell asleep at the Tea Party?', 'The person who fell asleep at the Tea Party is the Dormouse.'), ('What is rule 42 and why is it important for Alice?', ' Rule 42 is the oldest rule in the book and it dictates that all persons more than a mile high must leave the court. This impacts Alice because she is not a mile high and therefore must leave the court.')]

Question:  From what is the Caterpillar in Alice’s Adventures in Wonderland smoking?
Answer:    A hookah.

Current Chat History:  [('Who has written Alice’s Adventures in Wonderland?', ' Lewis Carroll.'), ('What game does Alice play?', ' Alice plays a game of croquet in Wonderland.'), ('Who said - Off with their heads?', ' The Queen of Hearts said "Off with their heads".'), ('What was the last part of the cat to disappear?', ' The grin.'), ('What is written on the potion bottle that Alice drinks?', ' The potion bottle says "Drink me."'), ('Who fell asleep at the Tea Party?', 'The person who fell asleep at the Tea Party is the Dormouse.'), ('What is rule 42 and why is it important for Alice?', ' Rule 42 is the oldest rule in the book and it dictates that all persons more than a mile high must leave the court. This impacts Alice because she is not a mile high and therefore must leave the court.'), ('From what is the Caterpillar in Alice’s Adventures in Wonderland smoking?', '  A hookah.')]

Question:  Which character serves as herald to the King and Queen of Hearts?
Answer:   The White Rabbit.

Current Chat History:  [('Who has written Alice’s Adventures in Wonderland?', ' Lewis Carroll.'), ('What game does Alice play?', ' Alice plays a game of storytelling in Wonderland.'), ('Who said - Off with their heads?', ' The Rabbit said "Off with their heads".'), ('Where was the cat from?', ' The context does not contain any information regarding who said "Off with their heads", so I cannot answer this question from the provided context.'), ('What was the last part of the cat to disappear?', ' The grin.'), ('What is written on the potion bottle that Alice drinks?', ' The potion bottle says "Drink me."'), ('Who fell asleep at the Tea Party?', '\n\nThe person who fell asleep at the Tea Party is the Dormouse.'), ('What is rule 42 and why is it important for Alice?', ' Rule 42 is the oldest rule in the book and it dictates that all persons more than a mile high must leave the court. This impacts Alice because she is not a mile high and therefore must leave the court.'), ('From what is the Caterpillar in Alice’s Adventures in Wonderland smoking?', '  A hookah.'), ('Which character serves as herald to the King and Queen of Hearts?', ' The White Rabbit.')]
```

<p>Hope you enjoyed this piece, check out the entire code on <a href="https://github.com/jigyasa-grover/Book-Buddy-Interactive-Storytelling-using-a-Gemma-based-RAG">github.com/jigyasa-grover/Book-Buddy-Interactive-Storytelling-using-a-Gemma-based-RAG</a> 🐈‍⬛</p>


<br><br>
<pre class="wp-block-preformatted">#BuildWithAI  #BuildWithGemini  #GeminiSprint  #GemmaSprint</pre>
