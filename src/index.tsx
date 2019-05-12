import React from 'react';
import ReactDOM from 'react-dom';
import { Customizer, Fabric} from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons'
import { FluentCustomizations } from '@uifabric/fluent-theme';
import App from './App';
import 'office-ui-fabric-react/dist/css/fabric.css';
import './index.css';

initializeIcons();

ReactDOM.render(
    <Customizer {...FluentCustomizations}>
        <Fabric dir="ltr">
            <App />
        </Fabric>
    </Customizer>,
    document.getElementById('root')
)