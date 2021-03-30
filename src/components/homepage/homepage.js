import LeftNavbar from '../left-navbar/left-navbar'
import homeImage from '../../homeImage.png'
export default function HomePage() {
    return (
        <div className="App">
            <LeftNavbar pageTitle="Case Factor Application" />
            <div className="content-page">
                <div className="content">
                    <div className="container-fluid card shadow p-3 bg-white rounded-1">
                        <div className="row justify-content-center">
                            <div class="col-4">
                                <img alt="Welcome to Case Factor" src={homeImage} width="100%" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}