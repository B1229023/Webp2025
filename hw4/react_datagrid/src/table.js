
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid'; //表格元件
import { TextField, Box, Typography } from '@mui/material'; //搜尋輸入、排版、文字標題

const columns = [
  { field: 'id', headerName: 'ID', width: 70 }, // 必要欄位
  { field: 'title', headerName: '名稱', width: 300 },
  { field: 'location', headerName: '景點', width: 300 },
  { field: 'price', headerName: '票價', width: 150 },
];

export default function MyDataGrid() {
  //useState宣告狀態
  const [rows, setRows] = useState([]); //setRows更新rows(完整資料)陣列狀態，初始值[](空)
  const [filterRows, setFilterRows] = useState([]);//setFiltersRows更新filterRows(搜尋後的資料)狀態，初始值[](空)
  const [search, setSearch] = useState('');//setSearch更新search(字串狀態)搜尋框輸入的關鍵字，初始值為''(空)
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch('https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6')
      .then(res => res.json()) //將資料轉為json格式
      .then(data => { //data就是從API拿到的json資料，可以在這裡處理資料
        const formattedData = data.map((item, index) => ({ //map() 是一個陣列方法，逐一處理陣列中的每一筆資料，並回傳一個新的陣列。
          id: index + 1, // DataGrid 需要唯一 ID ,index 資料在陣列中的索引位置
          title: item.title, //活動 , item:每一筆資料
          location: item.showInfo?.[0]?.location || '無資料',//地點
          price: item.showInfo?.[0]?.price || '無資料',//票價
        }));
        setRows(formattedData);//把取得的資料陣列存進rows
        setFilterRows(formattedData);//儲存初始的資料進入setfilter
      });
  }, []);//只在首次載入執行，空陣列不會重新執行

  useEffect(() => {
    if (search.trim() === '') {//search.trim()搜尋輸入的文字並去除前後的空白 if為空
      setFilterRows(rows);//顯示所有資料
    } else {
      setFilterRows(//.filter()過濾出符合條件的資料 includes判斷title字串是否包含關鍵字
        rows.filter(row => row.title.includes(search.trim())) 
      );
    }
  }, [search, rows]);//search和row有變化就改變

  return (
    <Box sx={{ height: 600, width: '100%', padding: 2 }}>
      <Typography variant="h4" gutterBottom>景點觀光展覽資訊</Typography>
      <TextField //表格標題
        label="搜尋活動名稱"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <DataGrid //顯示表格
        rows={filterRows}
        columns={columns}
        paginationModel={{ pageSize: 10, page }}
        onPaginationModelChange={(model) => setPage(model.page)} 
        pageSizeOptions={[]}   
       // pageSize={10}
        //rowsPerPageOptions={[]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

