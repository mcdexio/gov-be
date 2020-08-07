

all: build

codegen:
	graph codegen subgraph.ropsten.yaml

build: codegen
	graph build subgraph.ropsten.yaml

deploy: codegen
	graph deploy --debug --node https://api.thegraph.com/deploy/ --ipfs https://api.thegraph.com/ipfs/ amxx/mcdex-voting-box subgraph.ropsten.yaml
