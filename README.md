# NFT OWERNSHIP VERIFICATION

## How To Create an NFT Ownership Verification Tool Using Blockspan API

Blockspan API offers a wealth of data about NFTs. It's a treasure trove for developers who want to build applications around NFTs, whether it's for pricing, trading, analytics, or anything else you can imagine in the NFT space.

In this guide, we'll create a web application that allows users to verify their ownership of NFTs within a specific collection. The user will input their wallet address and a specific NFT collection contract, and our application will use the Blockspan API to retrieve and display the relevant information. 

## REQUIREMENTS:
- Node.js and npm installed on your system.
- Basic knowledge of React.js
- Blockspan API key


## STEP 1: SETTING UP THE REACT APP

First, we need to create a new React application. Open your terminal, navigate to the directory where you want to create your project, and run the following command:

`npx create-react-app nft-ownership-verification`

This will create a new folder `nft-ownership-verification` with all the necessary files and dependencies for a React application.


## STEP 2: INSTALL AXIOS

We'll be using Axios to make HTTP requests to the Blockspan API. Navigate into your new project folder and install Axios:

`cd nft-ownership-verification`
`npm install axios`


## STEP 3: CREATE A NEW COMPONENT

In the `src` directory, create a new file `NFTVerification.js`. This will be our main component for NFT ownership verification.


## STEP 4: WRITING THE COMPONENT

In `NFTVerification.js`, we'll import App.css, React and Axios, then set up our component with the necessary state variables for the wallet address, contract address, and data:

```
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function NFTVerification() {
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState('');
  const [blockchain, setBlockchain] = useState('eth-main');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // verifyOwnership function

  // additional helper functions

  return (
    // JSX code
  );
}

export default NFTVerification;
```

## STEP 5: FETCHING AND DISPLAYING THE DATA

We'll add a function `verifyOwnership` to our component that makes a GET request to the Blockspan API and sets the response data in our state:

```
  const verifyOwnership = async () => {
    const url = `http://localhost:8080/v1/collections/owner/${address}?chain=${blockchain}&page_size=25`;
    const headers = {
      accept: 'application/json',
      'X-API-KEY': 'YOUR_BLOCKSPAN_API_KEY',
    };

    try {
      const response = await axios.get(url, { headers });
      console.log('API call 1:', response);
      const filteredResults = response.data.results.filter(
        result => result.contract_address === contract
      );
      const collectionPromises = filteredResults.map(async result => {
        const collectionUrl = `http://localhost:8080/v1/collections/contract/${result.contract_address}?chain=${blockchain}`;
        const collectionResponse = await axios.get(collectionUrl, { headers });
        console.log('API call 2:', collectionResponse);
        return {
          ...result,
          name: collectionResponse.data.name,
          imageUrl: collectionResponse.data.image_url,
        };
      });
      const collectionsWithData = await Promise.all(collectionPromises);
      setData({ ...response.data, results: collectionsWithData });
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Error: Verify that chain and wallet address are valid!');
      setData(null);
    }
  };
  ```

We will add two helper functions which help simplify our code:

```
  const handleBlockchainChange = event => {
    setBlockchain(event.target.value);
  };

  const checkData = data => (data ? data : 'N/A');
```


Our JSX code will display a form for the user to select a chain and input their wallet address and contract address, and a button to initiate the verification. After the data is fetched, it will be displayed in a table:

```
return (
    <div>
      <h1 className="title">NFT Ownership Verification</h1>
      <p className="message">
        Input a wallet address and contract address below to check if that wallet owns the NFT.
      </p>
      <div className="inputContainer">
        <select name="blockchain" value={blockchain} onChange={handleBlockchainChange}>
          <option value="eth-main">eth-main</option>
          <option value="arbitrum-main">arbitrum-main</option>
          <option value="optimism-main">optimism-main</option>
          <option value="poly-main">poly-main</option>
          <option value="bsc-main">bsc-main</option>
          <option value="eth-goerli">eth-goerli</option>
        </select>
        <input type="text" placeholder="Wallet Address" onChange={e => setAddress(e.target.value)} />
        <input type="text" placeholder="Contract Address" onChange={e => setContract(e.target.value)} />
        <button onClick={verifyOwnership}>Verify Ownership</button>
      </div>
      {error && <p className="errorMessage">{error}</p>}
      {data !== null && data.results.length === 0 && (
        <p className="errorMessage">Owner does not own NFT in provided contract address!</p>
      )}
      {data !== null && data.results.length > 0 && (
        <div>
          <p className="successMessage">Collection found!</p>
          {console.log(data)}
          <h2>Details:</h2>
          <table>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>Name</th>
                <th>Token Type</th>
                <th>Contract Address</th>
                <th>Total Tokens</th>
                <th>Total Quantity</th>
                <th>Spam</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((result, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}>
                  <td>{checkData(result.name)}</td>
                  <td>{checkData(result.token_type)}</td>
                  <td>{checkData(result.contract_address)}</td>
                  <td>{checkData(result.total_tokens)}</td>
                  <td>{checkData(result.total_quantity)}</td>
                  <td>{checkData(result.is_potential_spam)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
```

Finally, we will enhance the user interface in the browser by replacing all code in the App.css file with the following:

```
.App {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}

.inputContainer {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.inputContainer input {
  padding: 10px;
  font-size: 1em;
  width: 200px;
}

.inputContainer button {
  padding: 10px;
  font-size: 1em;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
}

.inputContainer button:hover {
  background-color: #0056b3;
}

.message {
  text-align: center;
}

.errorMessage {
  text-align: center;
  color: red;
  font-weight: bold;
}

.successMessage {
  text-align: center;
  color: green;
  font-weight: bold;
}


.title {
  margin-top: 20px;
  margin-bottom: 0;
  text-align: center;
}

th, td {
  padding: 10px;
  text-align: left;
}
```


## STEP 6: INTEGRATING THE COMPONENT

Finally, let's integrate our `NFTVerification` component into the main application. In `App.js`, import and use the `NFTVerification` component:

```
import React from 'react';
import './App.css';
import NFTVerification from './NFTVerification';

function App() {
  return (
    <div className="App">
      <NFTVerification />
    </div>
  );
}

export default App;
```

Now, you can start your application by running `npm start` in your terminal. You should see the following:
- A dropdown menu to select a blockchain
- Text boxes for wallet and contract address
- A verify ownership button

Input the data of the NFT and wallet you want to check, and click the verify ownership button. You should then see a green "collection found" message and a table with the NFT information, or a red error message. 

This wraps up our guide to creating an NFT Ownership Verification tool using the Blockspan API and React.js. Happy coding!


## CONCLUSION

Congratulations! You've just built a simple yet powerful NFT ownership verification tool using the Blockspan API and React.js. As you've seen, the Blockspan API is intuitive to use and provides detailed and accurate information, making it a perfect choice for this kind of application.
This tutorial is just a starting point - there are many ways you can expand and improve your tool. For example, you could add more error checking, improve the UI, or add support for more blockchains.

As the world of NFTs continues to grow and evolve, tools like this will become increasingly important. Whether you're an NFT enthusiast, a developer, or a startup, understanding how to verify NFT ownership is a valuable skill.
We hope you found this tutorial helpful.