
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useValues } from '../context/ValuesContext';
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { EscolherIcon, IconeTipo } from '../utils/Util';
import TransacaoModal from './TransacaoForm';
import { useEffect, useState } from 'react';

export default function Grid() {
    const { transacoes, deletarTransacao } = useValues();
    const [showTransiction, setShowTransiction] = useState(false)
    const [update, setUpdate] = useState(null)

    useEffect(() => {
        setShowTransiction(update != null)
    },[update])

    const close = () => {
      setShowTransiction(false)
      setUpdate(null)
    }

    const columns = [
        {
            field: 'descricao',
            headerName: 'Descrição',
            flex: 2,
            minWidth: 200,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <div className='flex gap-2'>
                        {IconeTipo(params.row.tipo, 16)}
                        {EscolherIcon(params.row.categoria, 16)}
                    </div>
                    <span>{params.value}</span>
                </div>
            )
        },
        { field: 'dataTransacao', headerName: 'Data', flex: 1, minWidth: 100 },
        {
            field: 'categoria',
            headerName: 'Categoria',
            flex:1,
            minWidth: 160,
            renderCell: (params) => (
                <div className="flex items-center justify-center mt-3">
                    <div className="bg-[#1f273b] text-white rounded-lg w-full flex items-center justify-center h-6">
                        <span>{params.value}</span>
                    </div>
                </div>
            )
        },
        { field: 'valorFormatado', headerName: 'Valor', width: 100 },
        {
            field: 'acoes',
            headerName: '',
            width: 80,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div className="flex items-center justify-center mt-3 gap-2">
                    <div className="text-gray-700 rounded-lg w-full flex items-center justify-center h-6" onClick={() => setUpdate(params.row)}>
                        <FaRegEdit size={18} />
                    </div>
                    <div className="text-red-400 rounded-lg w-full flex items-center justify-center h-6" onClick={() => deletarTransacao(params.row.id)}>
                        <MdOutlineDelete size={20} />
                    </div>
                </div>
            )
        }
    ];


    return (
        <Box>
            <h2 className="text-xl font-bold text-gray-600">Histórico de transações</h2>
            <DataGrid style={{ maxHeight: '400px', }}
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

            {showTransiction && (
                <TransacaoModal
                    onClose={close}
                    update={update}
                />
            )}
        </Box>
    )
}
