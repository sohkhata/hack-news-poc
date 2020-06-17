import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button'
import UpVoteChart from './UpVoteChart';
import './App.css';

function getHostName(url) {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
  return match[2];
  }
  else {
      return null;
  }
}

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('items')) || []);
  const [page, setPage] = useState(0);
  const [nbPages, setMaxPage] = useState(null);

  const onHide = e => {
    let rowId = e.target.value;
    let updatedItems = items.filter( item => item.objectID !== rowId.toString());
    console.log(updatedItems);
    setItems(updatedItems);
  };

  const onUpvote = e => {
    let rowId = e.target.value;
    let updatedItems = items.map( item => {
      if (item.objectID === rowId.toString()) {
        item.points++;
      }
      return item;
    });
    console.log(updatedItems);
    setItems(updatedItems);
  };

  const getStory = pg => {
    fetch(`http://hn.algolia.com/api/v1/search?tags=story&page=${pg}&hitsPerPage=10`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.hits);
          setPage(result.page);
          setMaxPage(result.nbPages);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  };

  useEffect(() => {
    getStory(0)
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="App">
      <Table striped hover size="sm" responsive="sm" borderless>
        <thead>
          <tr>
            <th>Comments</th>
            <th>Vote Count</th>
            <th>UpVote</th>
            <th>News Details</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item =>
            (
          <tr key={item.objectID}>
            <td>{item.num_comments}</td>
            <td>{item.points}</td>
            <td><Button variant="link" value={item.objectID} onClick={onUpvote}>Upvote</Button></td>
            <td>
              {`${item.title} (${item.url}) by ${item.author} ${new Date(item.created_at).getHours()} hours ago`}
              [{<Button variant="link" value={item.objectID} onClick={onHide}>Hide</Button>}]
            </td>
          </tr>)
          )}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.Prev onClick={() => getStory(page - 1)} disabled={page < 1}/>
        <Pagination.Next onClick={() => getStory(page + 1)} disabled={page > nbPages}/>
      </Pagination>
      <UpVoteChart data={items}/>
    </div>
    );
  }
}

export default App;
