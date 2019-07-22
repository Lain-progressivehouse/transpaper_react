import React, {ChangeEvent, useCallback, useState} from 'react';
// @ts-ignore
import {Document, Page, pdfjs} from "react-pdf";
import {Button, Container, Header, Icon, Segment} from "semantic-ui-react";
import axios from "axios";

import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const App: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [base, setBase] = useState<string | ArrayBuffer | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [sendFile, setSendFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setSendFile(file);
      const reader = new FileReader()
      if (file)
        reader.readAsDataURL(file)
      reader.onload = () => {
        setBase(reader.result);
        setName(file.name);
      }
    }
  }

  // @ts-ignore
  const handleDocumentLoad = ({numPages}) => {
    setNumPages(numPages)
  }

  const handleButtonClick = (page: number) => {
    setPage(page);
  }

  const sendPDF = () => {
    if (sendFile) {
      setIsLoading(true);
      const params = new FormData();
      params.append("file", sendFile);
      axios.post(
        "http://0.0.0.0:5000/react",
        params,
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }
      ).then((result) => {
        console.log(result)
        setIsLoading(false);
      })
        .catch(() => {
          console.log('upload failed...');
          setIsLoading(false);
        });
    }
  }

  return (
    <div className="component">
      <Container style={{marginTop: '7em'}}>
        <Segment placeholder>
          <Header icon>
            <Icon name="file pdf"/>
            <Document
              file={base}
              // style={{border: 'dotted 1px #aaa'}}
              onLoadSuccess={handleDocumentLoad}
            >
              <Page
                pageNumber={page}
                height={300}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                renderInteractiveForms={true}
                // style={{border: 'solid 2px #000', height: 300}}
              />
            </Document>
            <div>{name}</div>
            {page || 1} / {numPages || '-'}
            <div className="ui two buttons">
              <Button
                disabled={page <= 1}
                onClick={() => handleButtonClick(page - 1)}
              >Prev</Button>
              <Button
                disabled={!numPages || page >= numPages}
                onClick={() => handleButtonClick(page + 1)}
              >Next</Button>
            </div>
          </Header>
          <Button primary>
            <input type="file" onChange={(e) => handleChange(e)} className="inputFileBtnHide"/>
            Add Document
          </Button>
          <Button primary>
            <input type="submit" onClick={sendPDF} className="inputFileBtnHide"/>
            Send Document
          </Button>
        </Segment>
      </Container>
    </div>
  );
}

export default App;
