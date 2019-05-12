import React from 'react';
import { Depths } from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import { Text } from 'office-ui-fabric-react/lib/Text';
import { Separator, Icon, CommandBar, List, ScrollablePane } from 'office-ui-fabric-react';

const App: React.FC = () => {
  return (
    <div style={{height: "100%"}}>
      <div>
        <CommandBar
          items={[
            {
              key: 'openFile',
              name: 'Open ChainCode',
              iconProps: {
                iconName: 'OpenFile'
              }
            },
            {
              key: 'extractCC',
              name: 'Extract ChainCode',
              disabled: true,
              iconProps: {
                iconName: 'Share'
              },      
              onClick: () => console.log('Download')
            }      
          ]}
        />
      </div>
      <div className="ms-Grid" style={{height: "100%", paddingBottom: "32px"}}>
        <div className="ms-Grid-row" style={{height: "100%"}}>
          <div className="ms-Grid-col ms-sm5" style={{height:"100%", paddingTop: "8px", paddingBottom: "16px", paddingRight: "10px", paddingLeft: "16px"}}>
            <ChaincodeDetails/>
          </div>
          <div className="ms-Grid-col ms-sm7" style={{height:"100%", paddingTop: "8px", paddingBottom: "16px", paddingRight: "16px", paddingLeft: "10px"}}>
            <ChaincodeSignatures/>
          </div>
        </div>
      </div>
    </div>
  );
}
  
export default App;

const GridIcon = (props: any) => {
  return (
    <div className="ms-Grid-col ms-sm1">
      <Icon iconName={props.iconName} style={{padding: "4px 8px", ...props.style}}/>
    </div>
  );
}

const TopLevelCard = (props: any) => {
  return (
    <div className="ms-Grid" style={{height: "95%", boxShadow: Depths.depth16}}>
      <div className="ms-Grid-row" style={{paddingTop: "8px"}}>
        <GridIcon iconName={props.iconName} style={{fontSize: "17px"}}/>
        <Text className="ms-Grid-col ms-sm11" variant={'large'}>{props.title}</Text>
      </div>
      <Separator/>
      {props.children}
    </div>
  );
}

const DetailsLine = (props: {label: string; value?: string; children?: string; iconName?: string}) => {
  return (
    <div className="ms-Grid-row" style={{padding: "8px 0"}}>
        { props.iconName
          ? <GridIcon iconName={props.iconName}/>
          : <div className="ms-Grid-col ms-sm1"/>
        }
      <Text className="ms-Grid-col ms-sm4" variant="mediumPlus">{props.label}</Text>
      <Text className="ms-Grid-col ms-sm6">{props.value || props.children}</Text>
    </div>
  );
}

const CertificateCard = (props: any) => {
  return (
    <div className="ms-Grid" style={{boxShadow: Depths.depth4, marginLeft: "32px", marginRight: "32px"}}>
      <DetailsLine label="Subject" iconName="ReminderPerson">Subject</DetailsLine>
      <DetailsLine label="Issuer" iconName="PartyLeader">Issuer</DetailsLine>
      <DetailsLine label="Validity" iconName="Calendar">Date</DetailsLine>
      <DetailsLine label="Public Key" iconName="Script">Base64 Public Key</DetailsLine>
    </div>
  );
}

const SignatureCard = (props: any) => {
  return (
    <div className="ms-Grid" style={{boxShadow: Depths.depth8, margin: "32px"}}>
      <DetailsLine label="Certificate" iconName="Certificate" value=" "></DetailsLine>
      <CertificateCard/>
      <DetailsLine label="MSP" iconName="SecurityGroup">DLTLabMSP</DetailsLine>
      <DetailsLine label="Signature value" iconName="CheckMark">BASE64VALUE</DetailsLine>
    </div>
  );
}

const ChaincodeDetails = () => {
  return (
    <TopLevelCard iconName="ExternalTFVC" title="Chaincode Details">
      <DetailsLine label="Name" iconName="FileCode">prenda</DetailsLine>
      <DetailsLine label="Version" iconName="OEM">1.0</DetailsLine>
      <DetailsLine label="Language" iconName="Embed">node</DetailsLine>
      <DetailsLine label="Size" iconName="OfflineStorageSolid">400KB</DetailsLine>
      <DetailsLine label="Instantiation policy" iconName="ProtectionCenterLogo32">AND('DLTLab.admin')</DetailsLine>
    </TopLevelCard>
  );
}
  
const ChaincodeSignatures = () => {
  return (
    <TopLevelCard iconName="CertifiedDatabase" title="Signatures">
      <div style={{height: "85%", position: "relative"}}>
        <ScrollablePane>
          <List items={
              [
                <SignatureCard/>,
                <SignatureCard/>,
                <SignatureCard/>
              ]
            }
            onRenderCell={() => <SignatureCard/>}
          ></List>

        </ScrollablePane>
      </div>
    </TopLevelCard>
  );
}