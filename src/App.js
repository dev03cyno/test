import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FiUploadCloud } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [sheetData, setSheetData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const Items = [
    "Avana100mg4tablets",
    "CYFLOX200MG 10TABS (1X1X10)",
    "CYFLU150MG 1TABS (1X1X1)",
    // "AVANA100MG24TABLETS"
  ]

  const transform = () => {
    const transformedData = sheetData.map((row, rowIndex) => {
      const rowData = {};
      row.forEach((cellData, cellIndex) => {
        const header = sheetData[0][cellIndex];
        if (cellData === header) {
          return; // Skip the header row
        }
        rowData[header] = cellData;
      });
      return rowData;
    });

    const ignoredFirstObject = transformedData.slice(1);
    console.log(JSON.stringify(ignoredFirstObject));
  };

const handleFileSelect = (e) => {
  const file = e.target.files[0];

  if (
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'text/csv'
  ) {
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setSheetData(jsonData);
    };
    reader.readAsBinaryString(file);
  } else {
    toast.error("file type not supported")
  }
};


  return (
    <div className="mt-10 px-3">
      <h1 className="text-center px-2 font-semibold sm:text-4xl text-2xl">Upload files</h1>
      <p className="text-center mt-4 text-gray-400 sm:text-sm text-xs">Please upload a *.xlsx or csv file. Max 10MB each.</p>
      <div className="mt-10 text-center mx-auto max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl border border-sky-400 border-dashed px-3 py-7 bg-sky-50">
        <div className="text-center flex justify-center flex-col items-center">
          <FiUploadCloud className="text-7xl text-sky-400" />
          <p className="mt-5 text-sm text-gray-400">Upload your File</p>
        </div>
        <input
          type="file"
          onChange={(e) => {
            handleFileSelect(e);
          }}
          style={{ display: 'none' }}
          id="fileInput"
        />
        <label htmlFor="fileInput" className="custom-file-input px-10">
          <p className="bg-sky-400 w-32 h-10 m-auto text-center text-white flex justify-center items-center ">
            Browse File
          </p>
        </label>
      </div>
      {fileName && <p className="mt-3">{fileName}</p>}
      {sheetData && (
        // <table>
        //   <tbody>
        //     {sheetData.map((row, rowIndex) => (
        //       <tr  key={rowIndex}>
        //         {/* {console.log(row[0])} */}
        //         {row.map((cellData, cellIndex) => (
        //           {Items.includes(rows[0])?( <td key={cellIndex}>{cellData}</td>):(<td className='text-red-500' key={cellIndex}>{cellData}</td>)}
        //           // <td className='text-red-500' key={cellIndex}>{cellData}</td>
        //           // console.log(Items.includes(row[0])?`${row[0]} i am in here`:`${row[0]} i am not here`)
        //         ))}
        //       </tr>
        //     ))}
        //   </tbody>
        // </table>
        <table>
          <tbody>
            {sheetData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cellData, cellIndex) => {
                  const lowercaseRow0 = row[0].trim().toLowerCase();
                  const isMatch = Items.some(item => item.toLowerCase() === lowercaseRow0);
                  return (
                    <td
                      className={isMatch ? '' : 'text-red-500'}
                      key={cellIndex}
                    >
                      {cellData}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

      )}

      <button onClick={transform}>Transform</button>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;
