
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

export default function Grid() {

    const rows = [
        {
            id: 1,
            nome: 'NetJ1M',
            logo: 'https://ui-avatars.com/api/?name=NetJ1M&background=0D8ABC&color=fff&rounded=true',
            data: 'Janeiro 13, 2025',
            categoria: 'Carta',
            valor: 'R$ 35,99'
        },
        {
            id: 2,
            nome: 'Beupa',
            logo: 'https://ui-avatars.com/api/?name=Beupa&background=F89D13&color=fff&rounded=true',
            data: 'Janeiro 13, 2025',
            categoria: 'Carta',
            valor: 'R$ 193,30'
        },
        {
            id: 3,
            nome: 'Curtão',
            logo: 'https://ui-avatars.com/api/?name=Curtão&background=1ABC9C&color=fff&rounded=true',
            data: 'Janeiro 12, 2025',
            categoria: 'Carta',
            valor: 'R$ 670,50'
        },
        {
            id: 4,
            nome: 'Maguel',
            logo: 'https://ui-avatars.com/api/?name=Maguel&background=9B59B6&color=fff&rounded=true',
            data: 'Janeiro 12, 2025',
            categoria: 'Carta',
            valor: 'R$ 374,90'
        },
        {
            id: 5,
            nome: 'Merceda',
            logo: 'https://logo.clearbit.com/mercedes-benz.com', // Logo real da Mercedes
            data: 'Janeiro 12, 2025',
            categoria: 'Carta',
            valor: 'R$ 357,20'
        },
        {
            id: 6,
            nome: 'Estudo',
            logo: 'https://ui-avatars.com/api/?name=Estudo&background=2ECC71&color=fff&rounded=true',
            data: 'Janeiro 11, 2025',
            categoria: 'Carta',
            valor: 'R$ 275,27'
        },
        {
            id: 7,
            nome: 'Spotly',
            logo: 'https://logo.clearbit.com/spotify.com', // Logo real do Spotify
            data: 'Janeiro 11, 2025',
            categoria: 'Carta',
            valor: 'R$ 23,48'
        },
        {
            id: 8,
            nome: 'Carro',
            logo: 'https://ui-avatars.com/api/?name=Carro&background=E74C3C&color=fff&rounded=true',
            data: 'Janeiro 11, 2025',
            categoria: 'Carta',
            valor: 'R$ 153,60'
        },
    ];

    const columns = [
        {
            field: 'nome',
            headerName: 'Nome',
            width: 200,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                        src={params.row.logo}
                        alt={params.value}
                        style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/24'; // Fallback para imagem quebrada
                        }}
                    />
                    <span>{params.value}</span>
                </div>
            )
        },
        { field: 'data', headerName: 'Data', width: 180 },
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
        { field: 'valor', headerName: 'Valor', width: 100 },
    ];
    return (
        <Box>
            <h2 className="text-xl font-bold text-gray-600">Histórico de transações</h2>
            <DataGrid style={{ maxHeight: '400px' }}
                rows={rows}
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
