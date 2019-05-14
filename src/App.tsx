import React from 'react';
import { Depths } from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import { Text } from 'office-ui-fabric-react/lib/Text';
import { Separator, Icon, CommandBar, List, ScrollablePane } from 'office-ui-fabric-react';
import { Certificate } from '@fidm/x509';
declare var window: any
const remote = window.require('electron').remote;
const platform = window.require('os').platform;
const process = window.require('process');
const { execFileSync } = window.require('child_process');
const isDev = window.require('electron-is-dev');


function getPlatform() {
  switch (platform()) {
    case 'aix':
    case 'freebsd':
    case 'linux':
    case 'openbsd':
    case 'android':
      return 'linux';
    case 'darwin':
    case 'sunos':
      return 'mac';
    case 'win32':
      return 'win';
  }
};

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      canExtract: false,
      ccPath: "",
      chaincodeData: {
        "name": "",
        "version": "",
        "size": "",
        "language": "",
        "instantiationpolicy": {
          "identities": "",
          "rule": ""
        },
        "signatures": []
      }
    };
  }
  render() {
    return (
      <div style={{ height: "100%" }}>
        <div>
          <CommandBar
            items={[
              {
                key: 'openFile',
                name: 'Open ChainCode',
                iconProps: {
                  iconName: 'OpenFile'
                },
                onClick: () => {
                  let files = remote.dialog.showOpenDialog({ title: 'Open ChainCode Package', defaultPath: remote.app.getPath('home'), properties: ["openFile"] });
                  if(files===undefined) return remote.dialog.showErrorBox("Error opening chaincode", "Invalid path");
                  let ccPath = (files as string[])[0];
                  const binaryPath = isDev
                    ? process.cwd() + '/public/bin/' + getPlatform() + '/fabric-tools'
                    : process.resourcesPath + '/app.asar/build/bin/' + getPlatform() + '/fabric-tools'
                  const execArgs = ["chaincode", "showdetails", ccPath];
                  try {
                    let newChaincodeData = execFileSync(binaryPath, execArgs, {windowsHide: true, encoding: "utf8"});
                    this.setState({ chaincodeData: JSON.parse(newChaincodeData) });
                    this.setState({ canExtract: true, ccPath: ccPath });
                  } catch (err) {
                    remote.dialog.showErrorBox("Error opening chaincode", "" + err);
                  }
                }
              },
              {
                key: 'extractCC',
                name: 'Extract ChainCode',
                disabled: !this.state.canExtract,
                iconProps: {
                  iconName: 'Share'
                },
                onClick: () => {
                  let ccPath = this.state.ccPath;
                  let outPath = remote.dialog.showSaveDialog({title: "Extract to Tar Chaincode", defaultPath: remote.app.getPath('home')});
                  if(outPath===undefined) return remote.dialog.showErrorBox("Error extracting chaincode", "Invalid path");
                  const binaryPath = isDev
                    ? process.cwd() + '/public/bin/' + getPlatform() + '/fabric-tools'
                    : process.resourcesPath + '/app.asar/build/bin/' + getPlatform() + '/fabric-tools'
                  const execArgs = ["chaincode", "unpack", ccPath, outPath];
                  try {
                    execFileSync(binaryPath, execArgs, {windowsHide: true});
                  } catch (err) {
                    remote.dialog.showErrorBox("Error extracting chaincode", "" + err);
                  }
                }
              }
            ]}
          />
        </div>
        <div className="ms-Grid" style={{ height: "100%", paddingBottom: "32px" }}>
          <div className="ms-Grid-row" style={{ height: "100%" }}>
            <div className="ms-Grid-col ms-sm5" style={{ height: "100%", paddingTop: "8px", paddingBottom: "16px", paddingRight: "10px", paddingLeft: "16px" }}>
              <ChaincodeDetails chaincodeData={this.state.chaincodeData} />
            </div>
            <div className="ms-Grid-col ms-sm7" style={{ height: "100%", paddingTop: "8px", paddingBottom: "16px", paddingRight: "16px", paddingLeft: "10px" }}>
              <ChaincodeSignatures signatures={this.state.chaincodeData.signatures} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

const GridIcon = (props: any) => {
  return (
    <div className="ms-Grid-col ms-sm1">
      <Icon iconName={props.iconName} style={{ padding: "4px 8px", ...props.style }} />
    </div>
  );
}

const TopLevelCard = (props: any) => {
  return (
    <div className="ms-Grid" style={{ height: "95%", boxShadow: Depths.depth16 }}>
      <div className="ms-Grid-row" style={{ paddingTop: "8px" }}>
        <GridIcon iconName={props.iconName} style={{ fontSize: "17px" }} />
        <Text className="ms-Grid-col ms-sm11" variant={'large'}>{props.title}</Text>
      </div>
      <Separator />
      {props.children}
    </div>
  );
}

const DetailsLine = (props: { label: string; value?: string; children?: any; iconName?: string; iconColor?: string }) => {
  return (
    <div className="ms-Grid-row" style={{ padding: "8px 0" }}>
      {props.iconName
        ? <GridIcon iconName={props.iconName} style={{ color: props.iconColor || undefined }} />
        : <div className="ms-Grid-col ms-sm1" />
      }
      <Text className="ms-Grid-col ms-sm4" variant="mediumPlus">{props.label}</Text>
      <Text className="ms-Grid-col ms-sm6">{props.value || props.children}</Text>
    </div>
  );
}

const CertificateCard = (props: any) => {
  let cert: any = Certificate.fromPEM(props.pem).toJSON();;
  return (
    <div className="ms-Grid" style={{ boxShadow: Depths.depth4, marginLeft: "32px", marginRight: "32px" }}>
      <DetailsLine label="Subject" iconName="ReminderPerson">{"C=" + cert.subject.C + " ST=" + cert.subject.ST + " L=" + cert.subject.L + " O=" + cert.subject.O + " OU=" + cert.subject.OU + " CN=" + cert.subject.CN}</DetailsLine>
      <DetailsLine label="Issuer" iconName="PartyLeader">{"C=" + cert.issuer.C + " ST=" + cert.issuer.ST + " L=" + cert.issuer.L + " O=" + cert.issuer.O + " OU=" + cert.issuer.OU + " CN=" + cert.issuer.CN}</DetailsLine>
      <DetailsLine label="Validity" iconName="Calendar">{"From " + (new Date(cert.validFrom)).toLocaleDateString("es-ES") + " To " + (new Date(cert.validTo)).toLocaleDateString("es-ES")}</DetailsLine>
      <DetailsLine label="Public Key" iconName="Script">
        <Text style={{ fontFamily: 'monospace' }}>
          {cert.publicKeyRaw.toString('hex').replace(/..(?!$)/g, "$& ")}
        </Text>
      </DetailsLine>
    </div>
  );
}

const SignatureCard = (props: any) => {
  return (
    <div className="ms-Grid" style={{ boxShadow: Depths.depth8, margin: "32px" }}>
      <DetailsLine label="MSP" iconName="SecurityGroup">{props.signature.msp}</DetailsLine>
      <DetailsLine label="Certificate" iconName="Certificate" value=" "></DetailsLine>
      <CertificateCard pem={props.signature.certificate} />
      <DetailsLine label="Signature value" iconName={props.signature.valid ? "CheckMark" : "Cancel"} iconColor={props.signature.valid ? "#107c10" : "#e81123"}>
        <Text style={{ fontFamily: 'monospace' }}>
          {props.signature.signature.replace(/.{24}(?!$)/g, "$& ")}
        </Text>
      </DetailsLine>
    </div>
  );
}

const InstantiationCard = (props: any) => {
  return (
    <div className="ms-Grid" style={{ boxShadow: Depths.depth4, marginLeft: "32px", marginRight: "32px" }}>
      <DetailsLine label="Identities" iconName="Group">{props.instantiationPolicy.identities}</DetailsLine>
      <DetailsLine label="Rule" iconName="Commitments">{props.instantiationPolicy.rule}</DetailsLine>
    </div>
  );
}

const ChaincodeDetails = (props: any) => {
  return (
    <TopLevelCard iconName="ExternalTFVC" title="Chaincode Details">
      <DetailsLine label="Name" iconName="FileCode">{props.chaincodeData.name}</DetailsLine>
      <DetailsLine label="Version" iconName="OEM">{props.chaincodeData.version}</DetailsLine>
      <DetailsLine label="Language" iconName="Embed">{props.chaincodeData.language}</DetailsLine>
      <DetailsLine label="Size" iconName="OfflineStorageSolid">{props.chaincodeData.size}</DetailsLine>
      <DetailsLine label="Instantiation policy" iconName="ProtectionCenterLogo32" value=" "></DetailsLine>
      <InstantiationCard instantiationPolicy={props.chaincodeData.instantiationpolicy} />
    </TopLevelCard>
  );
}

const ChaincodeSignatures = (props: any) => {
  return (
    <TopLevelCard iconName="CertifiedDatabase" title="Signatures">
      <div style={{ height: "85%", position: "relative" }}>
        <ScrollablePane>
          <List items={props.signatures}
            onRenderCell={(signature) => <SignatureCard signature={signature} />}
          ></List>

        </ScrollablePane>
      </div>
    </TopLevelCard>
  );
}
