import { Provider } from 'react-redux'
import './app.css'
import ItemList from './components/ItemList'
import OcrTagger from './components/OcrTagger'
import 'bootstrap'
import { store } from './redux/store'
import { useState } from 'preact/hooks'
import { PageModeEnum } from './props/props-base'
import PersonList from './components/PersonList'

export function App() {
  const [pageMode, setPageMode] = useState<PageModeEnum>(PageModeEnum.SCAN)

  return (
    <div className="row justify-content-center mx-0">
      <div className="col-auto">
        <Provider store={store}>
            <div id="app-wrapper">
              {
                pageMode == PageModeEnum.SCAN && (
                  <>
                    <OcrTagger />
                    <ItemList setPageMode={setPageMode} />
                  </>
                )
              }
              {
                pageMode == PageModeEnum.PERSON && (
                  <>
                    <PersonList />
                  </>
                )
              }
            </div>
        </Provider>
      </div>
    </div>
  )
}
