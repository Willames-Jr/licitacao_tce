import { useContext, useState } from 'react'
import SidebarContext from 'context/SidebarContext'
import {
  SearchIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  OutlineCogIcon,
  OutlineLogoutIcon,
  Download,
} from 'icons'
import { Avatar, Badge, Input, Dropdown, DropdownItem, WindmillContext, Button, Modal, ModalHeader, ModalBody, ModalFooter } from '@roketid/windmill-react-ui'
import SearchableSelect from './SearchableSelect'
import NProgress from 'nprogress';

NProgress.configure({
    minimum: 0.3,
    easing: 'ease',
    speed: 500,
    showSpinner: false,
});


function Header() {
  const { mode, toggleMode } = useContext(WindmillContext)
  const { toggleSidebar } = useContext(SidebarContext)

  const maribondo = [
    {codigo: "11",text: "CAMARA MUNICIPAL - MARIBONDO",},
    {codigo: "160",text: "FUNDO MUNICIPAL DE PREVIDÊNCIA - MARIBONDO",},
    {codigo: "568",text: "FUNDO MUNICIPAL DE SAÚDE - MARIBONDO",},
    {codigo: "167",text: "PREFEITURA MUNICIPAL - MARIBONDO",},
    {codigo: "692",text: "SECRETARIA MUNICIPAL DE ASSISTÊNCIA SOCIAL - MARIBONDO",},
    {codigo: "199",text: "SECRETARIA MUNICIPAL DE EDUCAÇÃO - MARIBONDO",},
  ]

  const exercicios = [
    {codigo: "1"},
    {codigo: "2"},
    {codigo: "3"},
    {codigo: "4"},
    {codigo: "5"},
    {codigo: "6"},
    {codigo: "7"},
    {codigo: "8"},
    {codigo: "9"},
    {codigo: "10"},
    {codigo: "11"},
    {codigo: "12"},
    {codigo: "13"},
  ]

  const meses =[
    {codigo: "1"},
    {codigo: "2"},
    {codigo: "3"},
    {codigo: "4"},
    {codigo: "5"},
    {codigo: "6"},
    {codigo: "7"},
    {codigo: "8"},
    {codigo: "9"},
    {codigo: "10"},
    {codigo: "11"},
    {codigo: "12"},
  ]

  const [codigo, setCodigo] = useState("");
  const [mes, setMes] = useState("");
  const [exercicio, setExercicio] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [validation, setValidation] = useState({
    mes:[],
    codigo: [],
    exercicio: []
  })

  const validFields = (): boolean => {
    let errors = {
      mes:[],
      codigo: [],
      exercicio: []
    }
    let isValid = true;

    if (!mes) {
      errors.mes.push("O campo deve ser preenchido")
      isValid = false  
    }

    if (!codigo) {
      errors.codigo.push("O campo deve ser preenchido")
      isValid = false  
    }

    if (!exercicio) {
      errors.exercicio.push("O campo deve ser preenchido")
      isValid = false  
    }
    
    setValidation(errors)
    return isValid
  }

  const handleDownload = async () => {
    if (isBlocked) return
    setIsBlocked(true)
    if (!validFields()) {
      setIsBlocked(false)
      return
    }

    NProgress.start()
    const response = await fetch('/api/export-layouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({codigo,exercicio,mes})
    });
    const blob = await response.blob()
    
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'xmlFiles.zip';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    
    setIsBlocked(false)
    NProgress.done()
  }

  function handleNotificationsClick() {
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen)
  }

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* <!-- Mobile hamburger --> */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        {/* <!-- Search input --> */}
        <div className="flex justify-center flex-1 lg:mr-32">
          
        </div>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* <!-- Theme toggler --> */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === 'dark' ? (
                <SunIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>
          
          <Button onClick={() => setIsModalOpen(true)} iconLeft={Download}>Baixar Layouts</Button>
        </ul>
      </div>

      <Modal  isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>Aviso</ModalHeader>
        <ModalBody>
          Forneça as seguintes informações antes de prosseguir
          <div>
            <SearchableSelect
              items={maribondo}
              label="Unidade Gestora*"
              setValue={(value) => setCodigo(value)}
              textProp="text"
              valueProp="codigo"
              validation={validation.codigo}
              value={codigo}
            />

            <SearchableSelect
              items={exercicios}
              label="Exercício*"
              setValue={(value) => setExercicio(value)}
              textProp="codigo"
              valueProp="codigo"
              validation={validation.exercicio}
              value={exercicio}
            />

            <SearchableSelect
              items={meses}
              label="Mês*"
              setValue={(value) => setMes(value)}
              textProp="codigo"
              valueProp="codigo"
              validation={validation.mes}
              value={mes}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={handleDownload}>Aceitar</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button onClick={handleDownload} block size="large">
              Aceitar
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </header>
  )
}

export default Header
