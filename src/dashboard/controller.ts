import {
  Authorized,
  JsonController,
  Get,
  HttpCode,
  CurrentUser
} from 'routing-controllers'
import { Order } from '../orders/entity'
import { User } from '../users/entity'
import { Product } from '../products/entity'

@JsonController()
export default class dashboardController {

  @Authorized()
  @Get('/dashboard')
  @HttpCode(200)
  async getDashboard(
    @CurrentUser() currentUser: User
  ) {
      if (currentUser!.role === 'admin') {
        const pendingUsers = await User.find({
          where: {approved: false}
        })
        const users = await User.find()
        const products = await Product.find()
        const orders = await Order.find()
        const aprovedOrders = orders.filter(order => order.status === 'Approved')
        const penddingOrders = orders.filter(order => order.status === 'Pending')
        const declinedOrders = orders.filter(order => order.status === 'Declined')
        const purchasedOrders = orders.filter(order => order.status === 'Purchased')

        return {
          pendingUsers: pendingUsers.length,
          users: users.length,
          products: products.length,
          orders: orders.length,
          approvedOrders: aprovedOrders.length,
          declinedOders: declinedOrders.length,
          pendingOders: penddingOrders.length,
          purchasedOders: purchasedOrders.length
        }
      }

      const seller = currentUser!.profile
      const orders =  await Order.findAndCount({
        where: {seller}
      })
      const products = await Product.find({
        where: {seller}
      })
      return {
        user: currentUser,
        orders: orders.length,
        products: products.length
      }
    }
}
