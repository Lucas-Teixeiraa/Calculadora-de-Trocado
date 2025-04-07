import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, CurrencyDollar } from '@phosphor-icons/react';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  InputAdornment,
  TextField,
  Typography,
  IconButton,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

interface Denomination {
  valor: number;
  quantidade: number;
}

function App() {
  const [total, setTotal] = useState<string>('');
  const [recebido, setRecebido] = useState<string>('');
  const [trocoBreakdown, setTrocoBreakdown] = useState<Denomination[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          background: {
            default: darkMode ? '#1e1e2f' : '#f8f9fa', // Off-white no modo claro, cinza escuro no modo escuro
          },
          primary: {
            main: '#00796b', // Verde escuro
          },
          secondary: {
            main: '#0091ea', // Azul claro
          },
        },
        typography: {
          fontFamily: 'Roboto, Arial, sans-serif',
        },
      }),
    [darkMode]
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const calcularTroco = () => {
    setErrorMessage('');
    const totalNum = parseFloat(total);
    const recebidoNum = parseFloat(recebido);

    if (isNaN(totalNum) || isNaN(recebidoNum)) {
      setErrorMessage('Por favor, preencha ambos os valores corretamente!');
      return;
    }

    if (recebidoNum < totalNum) {
      setErrorMessage('O valor recebido deve ser maior ou igual ao total!');
      return;
    }

    let troco = recebidoNum - totalNum;
    const denominacoes: number[] = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05, 0.01];
    const breakdown: Denomination[] = [];

    denominacoes.forEach((valor) => {
      const quantidade = Math.floor(troco / valor);
      if (quantidade > 0) {
        breakdown.push({ valor, quantidade });
        troco = parseFloat((troco - quantidade * valor).toFixed(2));
      }
    });

    setTrocoBreakdown(breakdown);
  };

  const sugerirMelhoriaTroco = () => {
    const totalNum = parseFloat(total);
    const recebidoNum = parseFloat(recebido);
  
    if (isNaN(totalNum) || isNaN(recebidoNum) || recebidoNum < totalNum) {
      return null; // Não há sugestões se os valores forem inválidos ou insuficientes
    }
  
    const troco = recebidoNum - totalNum;
    const denominacoes: number[] = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05, 0.01];
    let sugestoes: number[] = [];
  
    denominacoes.forEach((valor) => {
      if (troco % valor !== 0 && recebidoNum % valor === 0) {
        sugestoes.push(valor);
      }
    });
  
    return sugestoes.length > 0 ? sugestoes : null;
  };

  const trocoIdeal = useMemo(() => {
    const totalNum = parseFloat(total);
    const recebidoNum = parseFloat(recebido);
    return !isNaN(totalNum) && !isNaN(recebidoNum) && recebidoNum >= totalNum
      ? (recebidoNum - totalNum).toFixed(2)
      : '0.00';
  }, [total, recebido]);

  const imprimirRecibo = () => {
    const reciboWindow = window.open('', '_blank');
    const reciboContent = `
      <html>
        <head>
          <title>Recibo de Troco</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h1 {
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f4f4f4;
            }
          </style>
        </head>
        <body>
          <h1>Recibo de Troco</h1>
          <p><strong>Valor Total:</strong> R$ ${parseFloat(total).toFixed(2)}</p>
          <p><strong>Valor Recebido:</strong> R$ ${parseFloat(recebido).toFixed(2)}</p>
          <p><strong>Troco:</strong> R$ ${trocoIdeal}</p>
          <table>
            <thead>
              <tr>
                <th>Denominação</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              ${trocoBreakdown
                .map(
                  (item) => `
                <tr>
                  <td>R$ ${item.valor.toFixed(2)}</td>
                  <td>${item.quantidade}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <p style="text-align: center; margin-top: 20px;">Volte Sempre</p>
        </body>
      </html>
    `;
    reciboWindow?.document.write(reciboContent);
    reciboWindow?.document.close();
    reciboWindow?.print();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.default',
          padding: 2,
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 3,
            boxShadow: 4,
            padding: 4,
          }}
        >
          {/* Conteúdo principal */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography
              variant="h4"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              gap={1}
              color="primary"
            >
              Calculadora de Trocados <Calculator size={32} />
            </Typography>
            <IconButton onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
          <Typography variant="subtitle1" color="textSecondary" mb={3}>
            Sua solução inteligente para cálculo de troco
          </Typography>
          <Box component="form" noValidate autoComplete="off" mb={3}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Valor Total a Pagar"
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                onBlur={() => {
                  if (total) {
                    setTotal(parseFloat(total).toFixed(2)); // Formata com duas casas decimais
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyDollar size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Valor Recebido"
                type="number"
                value={recebido}
                onChange={(e) => setRecebido(e.target.value)}
                onBlur={() => {
                  if (recebido) {
                    setRecebido(parseFloat(recebido).toFixed(2)); // Formata com duas casas decimais
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyDollar size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            {errorMessage && (
              <Typography color="error" variant="body2" mt={1}>
                {errorMessage}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={calcularTroco}
            >
              Calcular Troco
            </Button>
          </Box>
          {trocoBreakdown.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" mb={2}>
                Troco Ideal: R$ {trocoIdeal}
              </Typography>
              <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                {trocoBreakdown.map((item, index) => (
                  <Box
                    key={index}
                    p={2}
                    borderRadius={2}
                    boxShadow={2}
                    bgcolor={darkMode ? 'grey.800' : 'grey.100'}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      {item.quantidade}x
                    </Typography>
                    <Typography variant="body2">R$ {item.valor.toFixed(2)}</Typography>
                  </Box>
                ))}
              </Box>
              {/* Botão para imprimir o recibo */}
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={imprimirRecibo}
              >
                Imprimir Recibo
              </Button>
            </Box>
          )}
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            textAlign: 'center',
            marginTop: 4,
            padding: 2,
            backgroundColor: darkMode ? 'grey.900' : 'grey.200',
            color: darkMode ? 'grey.300' : 'grey.800',
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="body2">
            Created by <strong>Lucas Teixeira</strong>. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;