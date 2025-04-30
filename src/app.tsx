import './app.css'
import OcrTagger from './components/OcrTagger'
import 'bootstrap'

export function App() {

  return (
    <div className="row justify-content-center mx-0">
      <div className="col-auto">
        <div id="app-wrapper">
          <OcrTagger />
        </div>
      </div>
    </div>
  )
}
