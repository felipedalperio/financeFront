
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useValues } from '../context/ValuesContext';
import { BsGlobe } from "react-icons/bs";
import { FaHome, FaShoppingBasket  } from "react-icons/fa";

export default function Grid() {
    const { transacoes } = useValues();


    const columns = [
        {
            field: 'descricao',
            headerName: 'Descrição',
            width: 180,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {EscolherIcon(params.row.categoria)}
                    <span>{params.value}</span>
                </div>
            )
        },
        { field: 'dataTransacao', headerName: 'dataTransacao', width: 150 },
        {
            field: 'categoria',
            headerName: 'Categoria',
            width: 150,
            renderCell: (params) => (
                <div className="flex items-center justify-center mt-3">
                    <div className="bg-[#1f273b] text-white rounded-lg w-full flex items-center justify-center h-6">
                        <span>{params.value}</span>
                    </div>
                </div>
            )
        },
        { field: 'valorFormatado', headerName: 'Valor', width: 100 },
    ];

    function EscolherIcon(name) {
        try {
            switch (name) {
                case 'Moradia':
                    return <FaHome size={20}/>
                case 'Mercado':
                    return <FaShoppingBasket size={20} />
                default:
                    return <BsGlobe size={20}/>

            }
        } catch (err) {
            return <BsGlobe size={20}/>
        }
    }

    return (
        <Box>
            <h2 className="text-xl font-bold text-gray-600">Histórico de transações</h2>
            <DataGrid style={{ maxHeight: '400px' }}
                rows={transacoes}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                hideFooter
                disableColumnResize
                sx={{
                    maxHeight: 400,
                    // Remove TODAS as bordas entre colunas
                    '& .MuiDataGrid-columnSeparator': {
                        display: 'none',
                    },
                    // Remove bordas das células
                    '& .MuiDataGrid-cell': {
                        borderRight: 'none',
                    },
                    // Remove bordas do cabeçalho
                    '& .MuiDataGrid-columnHeaders': {
                        borderRight: 'none',
                        '& .MuiDataGrid-columnHeader': {
                            borderRight: 'none',
                        },
                    },
                    // Remove borda externa (opcional)
                    border: 'none',
                }}
            />
        </Box>
    )
}
