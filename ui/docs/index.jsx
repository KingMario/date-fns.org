import React from 'react'
import classnames from 'classnames'
import routes from 'app/routes'
import docs from 'app/_lib/docs'

export default class Docs extends React.Component {
  static propTypes = {
    currentDocId: React.PropTypes.string
  }

  state = {
    query: null
  }

  render() {
    return <div className='docs'>
      <header className='docs-header'>
        <h2 className='docs-header_title'>
          Docs
        </h2>

        <div className='docs-search'>
          <input
            className='docs-search_field'
            placeholder='Search'
            value={this.state.query}
            onChange={(e) => this.setState({query: e.currentTarget.value})}
          />
        </div>
      </header>

      <ul className='docs-categories'>
        {this._renderCategories()}
      </ul>
    </div>
  }

  _renderCategories() {
    const filteredDocs = this._filteredDocs()
    const categoryNames = Object.keys(filteredDocs)
    return categoryNames.map((categoryName) => {
      const fns = filteredDocs[categoryName]

      return <li className='docs-category' key={categoryName}>
        <h3 className='docs-category_header'>
          {categoryName}
        </h3>

        <ul className='docs-functions'>
          {this._renderFunctions(fns)}
        </ul>
      </li>
    })
  }

  _renderFunctions(fns) {
    return fns.map((fn) => {
      return <li
        className={classnames(
          'docs-function', {
            'is-current': fn.name == this.props.currentDocId
          }
        )}
        onClick={this._openDoc.bind(this, fn.name)}
        key={fn.name}
      >
        <div className='docs-function_content'>
          <h4 className='docs-function_header'>
            {fn.name}
          </h4>
          <p className='docs-function_text'>
            {fn.summary}
          </p>
        </div>

        <div className='docs-function_icon'/ >
      </li>
    })
  }

  _filteredDocs() {
    const query = (this.state.query || '').toLowerCase()
    if (query) {
      return Object.keys(docs).reduce((acc, categoryName) => {
        const fns = docs[categoryName]
        const filteredFns = fns.filter((fn) => {
          return categoryName.toLowerCase().indexOf(query) != -1
            || fn.name.toLowerCase().indexOf(query) != -1
            || fn.summary.toLowerCase().indexOf(query) != -1
            || fn.description.toLowerCase().indexOf(query) != -1
        })
        if (filteredFns.length > 0) {
          acc[categoryName] = filteredFns
        }
        return acc
      }, {})
    } else {
      return docs
    }
  }

  _openDoc(fnName) {
    routes.navigateToRoute('doc', {docId: fnName})
  }
}