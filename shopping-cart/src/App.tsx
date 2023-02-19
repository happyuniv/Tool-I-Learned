import { Badge, Drawer, Grid, IconButton, LinearProgress } from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import Cart from './Cart/Cart'
import Item from './Item/Item'

export type CartItemType = {
  id: number
  category: string
  description: string
  image: string
  price: number
  title: string
  amount: number
}

const Wrapper = styled.div`
  margin: 40px;
`

const StyledButton = styled(IconButton)`
  position: fixed;
  z-index: 10;
  right: 20px;
  top: 20px;
`

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch('https://fakestoreapi.com/products')).json()

const App = () => {
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'product',
    getProducts
  )
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItemType[]>([])

  const handleAddToCart = (clickedItem: CartItemType) => {
    if (cartItems.find((item) => item.id === clickedItem.id))
      setCartItems(
        cartItems.map((item) => {
          if (item.id === clickedItem.id) item.amount += 1
          return item
        })
      )
    else {
      clickedItem.amount = 1
      setCartItems([...cartItems, clickedItem])
    }
  }

  const handleRemoveCart = (id: number) => {
    setCartItems(
      cartItems.reduce((acc, cur) => {
        if (cur.id === id) {
          if (cur.amount === 1) return acc
          else return [...acc, { ...cur, amount: cur.amount - 1 }]
        }
        return [...acc, cur]
      }, [] as CartItemType[])
    )
  }

  if (isLoading) return <LinearProgress />
  if (error) return <div>Something went wrong...</div>
  return (
    <Wrapper>
      <Drawer open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge
          variant='dot'
          color='primary'
          invisible={cartItems.length ? false : true}
        >
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  )
}

export default App
