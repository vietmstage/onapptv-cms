import React from 'react'
import { Loader } from 'semantic-ui-react'

export default function asyncComponent (getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = {Component: AsyncComponent.Component};

    componentWillMount () {
      if (!this.state.Component) {
        getComponent().then(Component => {
          AsyncComponent.Component = Component
          this.setState({Component})
        })
      }
    }

    render () {
      const {Component} = this.state
      if (Component) return <Component {...this.props} />
      else return <div className='div__loading-full'><Loader active /></div>
    }
  }
}
