import { FaHome, FaShoppingBasket, FaCar, FaHeartbeat, FaUtensils, FaBook, FaPlane, FaFilm, FaLaptop, FaTshirt, FaTools, FaBolt, FaPaw } from 'react-icons/fa'
import { MdSchool, MdLocalHospital, MdSportsSoccer } from 'react-icons/md'
import { BsGlobe } from 'react-icons/bs'
import { BiLineChart, BiLineChartDown  } from "react-icons/bi";


export function formatarValorCompleto(valor, moeda = 'BRL', locale = 'pt-BR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: moeda,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

export function formatarValor(valor, locale = 'pt-BR', minimumFractionDigits = 2) {
  return valor.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits
  });
}

export function IconeTipo(tipo, size) {
  try {
    switch (tipo) {
      case 'DESPESA':
        return <BiLineChartDown size={size} color='#cd4f4f' />
      case 'RECEITA':
        return <BiLineChart size={size} color='#63b873'/>
    }
  } catch (err) {
  
  }
}

export function EscolherIcon(name, size) {
  try {
    switch (name) {
      case 'Moradia':
        return <FaHome size={size} />
      case 'Mercado':
        return <FaShoppingBasket size={size} />
      case 'Transporte':
        return <FaCar size={size} />
      case 'Saúde':
        return <FaHeartbeat size={size} />
      case 'Educação':
        return <MdSchool size={size} />
      case 'Restaurante':
      case 'Alimentação':
        return <FaUtensils size={size} />
      case 'Lazer':
        return <FaFilm size={size} />
      case 'Tecnologia':
        return <FaLaptop size={size} />
      case 'Roupas':
        return <FaTshirt size={size} />
      case 'Serviços':
        return <FaTools size={size} />
      case 'Energia':
        return <FaBolt size={size} />
      case 'Animais':
        return <FaPaw size={size} />
      case 'Esportes':
        return <MdSportsSoccer size={size} />
      case 'Viagem':
        return <FaPlane size={size} />
      case 'Livros':
        return <FaBook size={size} />
      case 'Hospital':
        return <MdLocalHospital size={size} />
      default:
        return <BsGlobe size={size} />
    }
  } catch (err) {
    return <BsGlobe size={size} />
  }
}
