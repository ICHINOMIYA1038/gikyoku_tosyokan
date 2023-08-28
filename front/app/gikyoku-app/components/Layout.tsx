import Header from '@/components/Header'
import Footer from './Footer'

function Layout({ children } :any ) {
  return (
    <div >
      <div className="sticky-header">
        <Header />
      </div>
      <div className="header-gap"></div>
      <div style={{padding:"20px 40px"}}>
        { children }
      </div>
      <Footer/>
    </div>
  );
}

export default Layout;