require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const bcrypt = require('bcrypt')
const pool = require('./connection')

const vehicles = [
  {
    brand: 'Chevrolet', model: 'Onix', year: 2022, plate: 'ABC-1234',
    daily_rate: 120.00, city: 'São Paulo', state: 'SP',
    description: 'Onix 2022 automático, ar-condicionado, direção elétrica, IPVA pago.',
    image_url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
  },
  {
    brand: 'Volkswagen', model: 'Gol', year: 2020, plate: 'DEF-5678',
    daily_rate: 90.00, city: 'Rio de Janeiro', state: 'RJ',
    description: 'Gol 1.0 2020, econômico, ideal para cidade, revisado recentemente.',
    image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
  },
  {
    brand: 'Fiat', model: 'Argo', year: 2023, plate: 'GHI-9012',
    daily_rate: 130.00, city: 'Belo Horizonte', state: 'MG',
    description: 'Argo Drive 1.3 2023, completo, central multimídia, câmera de ré.',
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
  },
  {
    brand: 'Hyundai', model: 'HB20', year: 2021, plate: 'JKL-3456',
    daily_rate: 110.00, city: 'Curitiba', state: 'PR',
    description: 'HB20 Comfort 2021, muito conservado, com Bluetooth e controle de estabilidade.',
    image_url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80',
  },
  {
    brand: 'Toyota', model: 'Corolla', year: 2022, plate: 'MNO-7890',
    daily_rate: 200.00, city: 'Porto Alegre', state: 'RS',
    description: 'Corolla XEI 2022 automático, bancos de couro, teto solar, excelente conforto.',
    image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
  },
  {
    brand: 'Honda', model: 'Civic', year: 2021, plate: 'PQR-1122',
    daily_rate: 180.00, city: 'Campinas', state: 'SP',
    description: 'Civic Touring 2021, completo, piloto automático adaptativo e Honda Sensing.',
    image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
  },
  {
    brand: 'Jeep', model: 'Renegade', year: 2023, plate: 'STU-3344',
    daily_rate: 250.00, city: 'Florianópolis', state: 'SC',
    description: 'Renegade Longitude 2023 automático, 4x2, tração inteligente e teto solar panorâmico.',
    image_url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800&q=80',
  },
  {
    brand: 'Ford', model: 'Ka', year: 2020, plate: 'VWX-5566',
    daily_rate: 85.00, city: 'Salvador', state: 'BA',
    description: 'Ka SE 1.0 2020, econômico e ágil, perfeito para o dia a dia na cidade.',
    image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
  },
  {
    brand: 'Renault', model: 'Kwid', year: 2022, plate: 'YZA-7788',
    daily_rate: 95.00, city: 'Recife', state: 'PE',
    description: 'Kwid Intense 2022, com câmera de ré, central multimídia e ar-condicionado.',
    image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
  },
  {
    brand: 'Nissan', model: 'Versa', year: 2023, plate: 'BCD-9900',
    daily_rate: 160.00, city: 'Fortaleza', state: 'CE',
    description: 'Versa Advance 2023 automático, espaçoso, confortável e muito econômico.',
    image_url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80',
  },
]

async function seed() {
  try {
    const hash = await bcrypt.hash('123456', 10)

    // Upsert locador de exemplo
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', ['locador@exemplo.com'])
    let ownerId
    if (existing.length > 0) {
      ownerId = existing[0].id
      console.log(`Usuário locador já existe (id=${ownerId}), reutilizando.`)
    } else {
      const [r] = await pool.query(
        'INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)',
        ['Locador Exemplo', 'locador@exemplo.com', hash, 'locador', '(11) 99999-0000']
      )
      ownerId = r.insertId
      console.log(`Usuário locador criado (id=${ownerId}).`)
    }

    // Também cria um locatário de exemplo
    const [existingRenter] = await pool.query('SELECT id FROM users WHERE email = ?', ['locatario@exemplo.com'])
    if (existingRenter.length === 0) {
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)',
        ['Locatário Exemplo', 'locatario@exemplo.com', hash, 'locatario', '(11) 88888-0000']
      )
      console.log('Usuário locatário criado.')
    }

    // Insere veículos (pula se a placa já existir)
    let inserted = 0
    for (const v of vehicles) {
      const [dup] = await pool.query('SELECT id FROM vehicles WHERE plate = ?', [v.plate])
      if (dup.length > 0) { console.log(`Placa ${v.plate} já existe, pulando.`); continue }
      await pool.query(
        'INSERT INTO vehicles (owner_id, brand, model, year, plate, daily_rate, description, image_url, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [ownerId, v.brand, v.model, v.year, v.plate, v.daily_rate, v.description, v.image_url, v.city, v.state]
      )
      inserted++
    }

    console.log(`\n✓ Seed concluído. ${inserted} veículo(s) inserido(s).`)
    console.log('\nContas de teste:')
    console.log('  locador@exemplo.com   / 123456')
    console.log('  locatario@exemplo.com / 123456')
  } finally {
    await pool.end()
  }
}

seed().catch(err => { console.error(err); process.exit(1) })
