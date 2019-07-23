import React, {ChangeEvent, useState} from 'react';
// @ts-ignore
import {Document, Page, pdfjs} from "react-pdf";
import {Button, Container, Dimmer, Header, Icon, Loader, Segment, Input} from "semantic-ui-react";
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
  const [result, setResult] = useState<any | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setSendFile(file);
      const reader = new FileReader();
      if (file)
        reader.readAsDataURL(file);
      reader.onload = () => {
        setBase(reader.result);
        setName(file.name);
      }
    }
  };

  // @ts-ignore
  const handleDocumentLoad = ({numPages}) => {
    setNumPages(numPages)
  };

  const handleButtonClick = (page: number) => {
    setPage(page);
  };

  const sendPDF = () => {
    if (sendFile && !isLoading) {
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
      ).then((result) => { // 成功した場合
        setResult(result);
        setIsLoading(false);
      })
        .catch(() => {
          console.log('upload failed...');
          setIsLoading(false);
        });
    } else {
      // ファイルがロードされていないorファイル送信中
      console.log('ファイルがロードされていないorファイル送信中');
    }
  };

  const download = () => {
    if (name) {
      let baseName = new String(name).substring(name.lastIndexOf('/') + 1)
      if (baseName.lastIndexOf(".") != -1)
        baseName = baseName.substring(0, baseName.lastIndexOf("."));
      const element = document.createElement("a");
      const file = new Blob([result.data], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = baseName + ".txt";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }
  };

  return (
    <div className="component">
      <Container style={{marginTop: '7em'}}>
        <Segment placeholder>
          <Header icon>
            <Icon name="file pdf"/>
            <Document
              file={base}
              onLoadSuccess={handleDocumentLoad}
            >
              <Page
                pageNumber={page}
                height={300}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                renderInteractiveForms={true}
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
        </Segment>

        <Container style={{marginTop: '7em'}}>
          <Segment className="ui three wide widescreen buttons">
            <Button primary className="ui centered">
              <input type="file" accept=".pdf" onChange={(e) => handleChange(e)} className="inputFileBtnHide"/>
              <Icon name="upload"/>
              Add Document
            </Button>
            <br/>
            <br/>
            <Button primary disabled={!base} onClick={sendPDF}>
              <Icon name="cloud upload"/>
              Send Document
            </Button>

            <br/>
            <br/>
            <Button primary disabled={!result} onClick={download}>
              <Icon name="download"/>
              Download
            </Button>
          </Segment>
        </Container>

      </Container>
      <Dimmer active={isLoading} inverted>
        <Loader size='large'>Loading</Loader>
      </Dimmer>
      {/*<Form>*/}
      {/*  <TextArea placeholder='Tell us more' style={{ minHeight: 100 }} value={result || result.data}/>*/}
      {/*</Form>*/}
    </div>
  );
};

export default App;
