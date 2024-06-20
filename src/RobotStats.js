import React from "react";
import './RobotStats.css';
import { useState, useEffect, ScrollView, View } from 'react';
import exportFromJSON from 'export-from-json' 
import axios from 'axios';
  
 

export default function RobotStats() {
  const [CompNum, setCompNum] = useState("");
  const [state, setState] = useState("");
  const [Xls, setXls] = useState("");
  const ExportToExcel = (data, fileName, exportType) => {  
    exportFromJSON({ data, fileName, exportType})  
  }  
  // function waitForElement(elm){
  //   if(typeof elm !== "undefined"){
  //       ExportToExcel(elm, 'test', 'xls');
  //       console.log('done');
  //   }
  //   else{
  //       setTimeout(waitForElement, 250);
  //   }
  // }
  async function getData(elm) {
    try {
      const url = 'https://qk3wnkht7bgxymm53hhg7b7i5e0kbmba.lambda-url.us-east-1.on.aws/?CompNum='+elm;
      var data = await axios.get(url).catch(function (error) {
        if (error.response) {setState('Invalid ID')}});
      data = data['data']
      var dataXls=JSON.parse(JSON.parse(data['xls']));
      var dataHtml=JSON.parse(JSON.parse(data['html']));
      // var dataXls=data['xls'];
      // var dataHtml=data['html'];
      //console.log(dataXls);
      //console.log(typeof dataXls);
      localStorage.setItem("xls",data['xls']);
      localStorage.setItem("html",data['html']);
      CreateTableFromJSON(dataHtml);
      setXls(dataXls);
      //ExportToExcel(dataXls, 'CompData', 'xls');
      setState('Done!')
    } 
    catch (error) {
      console.log(error)
    }
  }
  function CreateTableFromJSON(json_data) {
    // EXTRACT VALUE FOR HTML HEADER. 
    var col = [];
    for (var i = 0; i < json_data.length; i++) {
        for (var key in json_data[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < json_data.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json_data[i][col[j]];
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
  }
  const handleSubmit = event => {
    event.preventDefault();
    setState('Loading...')
    console.log('loading');
    getData(CompNum)
    console.log('done')
  };

  const handleDownload = event => {
    event.preventDefault();
    try{
      if (localStorage.getItem('xls')!='')
      {
        setXls(JSON.parse(JSON.parse(localStorage.getItem('xls'))));
      }
      ExportToExcel(Xls, 'CompData', 'xls');
    }
    catch(error){
      console.log('Data not ready yet')
    }
   
  };
  useEffect(() => {
    try{
      CreateTableFromJSON(JSON.parse(JSON.parse(localStorage.getItem('html'))));
      //setXls(JSON.parse(JSON.parse(localStorage.getItem('xls'))));
    }
    catch(error) {
      console.log(error);
    }
  });

  return (
    <div className='main'>
      <header className='header'>{state}</header>
      <form onSubmit={handleSubmit} className="form">
        <label>Enter the competition id:
          <input
            type="text" 
            value={CompNum}
            onChange={(e) => setCompNum(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
        <button onClick={handleDownload}>Download</button>
      </form>      
      <p className='exp'>Enter the Event Code. Ex: RE-VRC-XX-XXXX</p>
      <p id="showData" className='scroll'></p>
    </div>
  )
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<RobotStats />);

