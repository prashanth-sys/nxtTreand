// Write your code here
// Write your code here
import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    apiStatus: apiStatusConstants.initial,
    count: 1,
    similearProducts: [],
  }

  componentDidMount() {
    this.getImageDetails()
  }

  getImageDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    console.log(response)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const updatedData = {
        id: data.id,
        imageURL: data.image_url,
        title: data.title,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        description: data.description,
        price: data.price,
      }
      this.setState({
        productData: updatedData,
        apiStatus: apiStatusConstants.success,
        similearProducts: data.similar_products,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickIncrement = () => {
    this.setState(prevstate => ({count: prevstate.count + 1}))
  }

  onClickDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevstate => ({count: prevstate.count - 1}))
    }
  }

  renderImageDetails = () => {
    const {productData, count, similearProducts} = this.state
    const {
      imageURL,
      title,
      description,
      price,
      totalReviews,
      availability,
      brand,
      rating,
    } = productData

    return (
      <>
        <Header />
        <div className="bg-container">
          <div className="image-container">
            <img src={imageURL} alt="product" className="image" />
          </div>
          <div>
            <h1>{title}</h1>

            <p>Rs {price}</p>
            <p>{rating}</p>
            <BsPlusSquare />
            <BsDashSquare />
            <div>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
              />
              <p>{totalReviews} Reviews</p>
              <p>{description}</p>
              <p>Available: {availability}</p>
              <p>Brand: {brand}</p>
              <div className="button-container">
                <button
                  type="button"
                  className="button"
                  data-testid="minus"
                  onClick={this.onClickDecrement}
                >
                  -
                </button>
                <p className="count">{count}</p>
                <button
                  type="button"
                  className="button"
                  data-testid="plus"
                  onClick={this.onClickIncrement}
                >
                  +
                </button>
              </div>
              <button type="button" className="button-to-carts">
                ADD TO CART
              </button>
            </div>
          </div>
          <div className="similar-products-container">
            {similearProducts.map(product => (
              <div key={product.id} className="similar-product">
                <img
                  src={product.image_url}
                  alt={`similar product ${product.id}`}
                />
                <p>{product.title}</p>
                <p>{product.brand}</p>
                <p>{product.rating}</p>
                <p>{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  renderFailureShow = () => {
    const URL =
      'https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png'
    return (
      <div className="failure-view-container">
        <img src={URL} alt="failure view" />
        <h1>Product Not Found</h1>
        <Link to="/products">
          <button type="button" onClick={this.navigateToProducts}>
            Continue Shopping
          </button>
        </Link>
      </div>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderImageDetails()
      case apiStatusConstants.failure:
        return this.renderFailureShow()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }
}
export default ProductItemDetails
