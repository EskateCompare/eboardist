import { connect } from 'react-redux';
import Product from './Product';
import { fetchProduct, fetchPostRecommend, fetchImpressions, fetchPostImpressions } from '../../../actions/Product';
import { addUserRecommendation, addUserImpression } from '../../../actions/User';

const mapStateToProps = function(state) {
  return ({
    ...state.Product,
    ...state.User,
  })
}

const mapDispatchToProps = dispatch => ({
  fetchProduct: (payload) => dispatch(fetchProduct(payload)),
  fetchPostRecommend: (payload) => dispatch(fetchPostRecommend(payload)),
  addUserRecommendation: (payload) => dispatch(addUserRecommendation(payload)),
  addUserImpression: (payload) => dispatch(addUserImpression(payload)),
  fetchImpressions: () => dispatch(fetchImpressions()),
  fetchPostImpressions: (payload) => dispatch(fetchPostImpressions(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Product);
