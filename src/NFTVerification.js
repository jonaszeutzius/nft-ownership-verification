import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function NFTVerification() {
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState('');
  const [blockchain, setBlockchain] = useState('eth-main');
  const [data, setData] = useState(null);

  const verifyOwnership = async () => {
    const url = `http://localhost:8080/v1/collections/owner/${address}?chain=${blockchain}&page_size=25`;
    const headers = { accept: 'application/json', 'X-API-KEY': '2jhzbqIWanB8puiqySBIWJVf6Ovp7oPW' };
    try {
      const response = await axios.get(url, { headers });
      const filteredResults = response.data.results.filter(result => result.contract_address === contract);
      const collectionPromises = filteredResults.map(async (result) => {
        const collectionUrl = `http://localhost:8080/v1/collections/contract/${result.contract_address}?chain=${blockchain}`;
        const collectionResponse = await axios.get(collectionUrl, { headers });
        return { ...result, name: collectionResponse.data.name, imageUrl: collectionResponse.data.image_url };
      });
      const collectionsWithData = await Promise.all(collectionPromises);
      setData({ ...response.data, results: collectionsWithData });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlockchainChange = (event) => {
    setBlockchain(event.target.value);
  }

return (
    <div>
      <h1 className='title'>NFT Ownership Verification</h1>
      <p className='message'>Input a wallet address and contract address below to check if that wallet owns the NFT.</p>
      <div className='inputContainer'>
        <select name='blockchain' value={blockchain} onChange={handleBlockchainChange}>
          <option value="eth-main">eth-main</option>
          <option value="arbitrum-main">arbitrum-main</option>
          <option value="optimism-main">optimism-main</option>
          <option value="poly-main">poly-main</option>
          <option value="bsc-main">bsc-main</option>
          <option value="eth-goerli">eth-goerli</option>
          {console.log('This is the blockchain:' + blockchain)}
        </select>   
        <input type="text" placeholder="Wallet Address" onChange={(e) => setAddress(e.target.value)} />   
        <input type="text" placeholder="Contract Address" onChange={(e) => setContract(e.target.value)} /> 
        <button onClick={verifyOwnership}>Verify Ownership</button>
      </div>
        {data && (
            <div>
                <p>
                  {/* {data.results.length() === 0 ? 'Owner does not own NFT' : 'Collection Found!'}
                  {console.log('Total collections = ',data.total_collections, typeof(data.total_collections))} */}
                </p>
                <h2>Details:</h2>
                <table>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Token Type</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Contract Address</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Total Tokens</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Total Quantity</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Spam</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.results.map((result, index) => (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{}</td>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{result.token_type}</td>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{result.contract_address}</td>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{result.total_tokens}</td>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{result.total_quantity}</td>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);
}

export default NFTVerification;