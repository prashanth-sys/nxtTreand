// Write your code here
// Write your code here
import {Component} from 'react'
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
  state = {productData: {}, apiStatus: apiStatusConstants.initial, count: 1}

  componentDidMount() {
    this.getImageDetails()
  }

  getImageDetails = async () => {
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
      })
    }
    if (response.status === 401) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderImageDetails = () => {
    const {productData, count} = this.state
    const {
      imageURL,
      title,
      description,
      price,
      totalReviews,
      availability,
      brand,
    } = productData

    return (
      <>
        <Header />
        <div className="bg-container">
          <div className="image-container">
            <img src={imageURL} alt="krishna" className="image" />
          </div>
          <div>
            <h1>{title}</h1>

            <p>Rs {price}</p>
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
                <button type="button" className="button">
                  -
                </button>
                <p className="count">{count}</p>
                <button type="button" className="button">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  renderFailureShow = () => {
    const URL =
      'https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png'
    return (
      <div>
        <img src={URL} alt="shiva paravathi" />
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="primedeals-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
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
