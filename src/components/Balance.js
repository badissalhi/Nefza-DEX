import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

import nfz_logo from "../assets/nfz_logo.png"
import eth_logo from "../assets/eth_logo.png"
import mDAI_logo from "../assets/mDAI_logo.png"

import { loadBalances, transferTokens } from "../store/interactions"

const Balance = () => {
    const [isDeposit, setIsDeposit] = useState(true)
    const [token1TransferAmount, setToken1TransferAmount] = useState(0)
    const [token2TransferAmount, setToken2TransferAmount] = useState(0)

    const dispatch = useDispatch()

    const provider = useSelector((state) => state.provider.connection)
    const account = useSelector((state) => state.provider.account)

    const exchange = useSelector((state) => state.exchange.contract)
    const exchangeBalances = useSelector((state) => state.exchange.balances)
    const transferInProgress = useSelector(
        (state) => state.exchange.transferInProgress
    )

    const tokens = useSelector((state) => state.tokens.contracts)
    const symbols = useSelector((state) => state.tokens.symbols)
    const tokenBalances = useSelector((state) => state.tokens.balances)

    const isNFZ = symbols && symbols[0] === "NFZ"
    const isSecondTokenNFZ = symbols && symbols[1] === "NFZ"

    const ismETH = symbols && symbols[0] === "mETH"
    const isSecondTokenmETH = symbols && symbols[1] === "mETH"

    const ismDAI = symbols && symbols[0] === "mDAI"
    const isSecondTokenmDAI = symbols && symbols[1] === "mDAI"

    const depositRef = useRef(null)
    const withdrawRef = useRef(null)

    const tabHandler = (e) => {
        if (e.target.className !== depositRef.current.className) {
            e.target.className = "tab tab--active"
            depositRef.current.className = "tab"
            setIsDeposit(false)
        } else {
            e.target.className = "tab tab--active"
            withdrawRef.current.className = "tab"
            setIsDeposit(true)
        }
    }

    const amountHandler = (e, token) => {
        if (token.address === tokens[0].address) {
            setToken1TransferAmount(e.target.value)
        } else {
            setToken2TransferAmount(e.target.value)
        }
    }

    const depositHandler = (e, token) => {
        e.preventDefault()

        if (token.address === tokens[0].address) {
            transferTokens(
                provider,
                exchange,
                "Deposit",
                token,
                token1TransferAmount,
                dispatch
            )
            setToken1TransferAmount(0)
        } else {
            transferTokens(
                provider,
                exchange,
                "Deposit",
                token,
                token2TransferAmount,
                dispatch
            )
            setToken2TransferAmount(0)
        }
    }

    const withdrawHandler = (e, token) => {
        e.preventDefault()

        if (token.address === tokens[0].address) {
            transferTokens(
                provider,
                exchange,
                "Withdraw",
                token,
                token1TransferAmount,
                dispatch
            )
            setToken1TransferAmount(0)
        } else {
            transferTokens(
                provider,
                exchange,
                "Withdraw",
                token,
                token2TransferAmount,
                dispatch
            )
            setToken2TransferAmount(0)
        }
    }

    useEffect(() => {
        if (exchange && tokens[0] && tokens[1] && account) {
            loadBalances(exchange, tokens, account, dispatch)
        }
    }, [exchange, tokens, account, transferInProgress, dispatch])

    return (
        <div className="component exchange__transfers">
            <div className="component__header flex-between">
                <h2>Balance</h2>
                <div className="tabs">
                    <button
                        onClick={tabHandler}
                        ref={depositRef}
                        className="tab tab--active"
                    >
                        Deposit
                    </button>
                    <button
                        onClick={tabHandler}
                        ref={withdrawRef}
                        className="tab"
                    >
                        Withdraw
                    </button>
                </div>
            </div>

            {/* Deposit/Withdraw Component 1 */}

            {/* Rendering conditions*/}
            {isNFZ ? (
                <div className="exchange__transfers--form">
                    <div className="flex-between">
                        <p>
                            <small>Token</small>
                            <br />
                            <img
                                src={nfz_logo}
                                alt="Nefza Token Logo"
                                className="token_logo"
                            />
                            {symbols && symbols[0]}
                        </p>
                        <p>
                            <small>Wallet</small>
                            <br />
                            {tokenBalances && tokenBalances[0]}
                        </p>
                        <p>
                            <small>Exchange</small>
                            <br />
                            {exchangeBalances && exchangeBalances[0]}
                        </p>
                    </div>

                    <form
                        onSubmit={
                            isDeposit
                                ? (e) => depositHandler(e, tokens[0])
                                : (e) => withdrawHandler(e, tokens[0])
                        }
                    >
                        <label htmlFor="token0">
                            {symbols && symbols[0]} Amount
                        </label>
                        <input
                            type="text"
                            id="token0"
                            placeholder="0.0000"
                            value={
                                token1TransferAmount === 0
                                    ? ""
                                    : token1TransferAmount
                            }
                            onChange={(e) => amountHandler(e, tokens[0])}
                        />

                        <button className="button" type="submit">
                            {isDeposit ? (
                                <span>Deposit</span>
                            ) : (
                                <span>Withdraw</span>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                ""
            )}

            {ismETH ? (
                <div className="exchange__transfers--form">
                    <div className="flex-between">
                        <p>
                            <small>Token</small>
                            <br />
                            <img
                                src={eth_logo}
                                alt="mETH Token Logo"
                                className="token_logo"
                            />
                            {symbols && symbols[0]}
                        </p>
                        <p>
                            <small>Wallet</small>
                            <br />
                            {tokenBalances && tokenBalances[0]}
                        </p>
                        <p>
                            <small>Exchange</small>
                            <br />
                            {exchangeBalances && exchangeBalances[0]}
                        </p>
                    </div>

                    <form
                        onSubmit={
                            isDeposit
                                ? (e) => depositHandler(e, tokens[0])
                                : (e) => withdrawHandler(e, tokens[0])
                        }
                    >
                        <label htmlFor="token0">
                            {symbols && symbols[0]} Amount
                        </label>
                        <input
                            type="text"
                            id="token0"
                            placeholder="0.0000"
                            value={
                                token1TransferAmount === 0
                                    ? ""
                                    : token1TransferAmount
                            }
                            onChange={(e) => amountHandler(e, tokens[0])}
                        />

                        <button className="button" type="submit">
                            {isDeposit ? (
                                <span>Deposit</span>
                            ) : (
                                <span>Withdraw</span>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                ""
            )}

            {ismDAI ? (
                <div className="exchange__transfers--form">
                    <div className="flex-between">
                        <p>
                            <small>Token</small>
                            <br />
                            <img
                                src={mDAI_logo}
                                alt="mDAI Token Logo"
                                className="token_logo"
                            />
                            {symbols && symbols[0]}
                        </p>
                        <p>
                            <small>Wallet</small>
                            <br />
                            {tokenBalances && tokenBalances[0]}
                        </p>
                        <p>
                            <small>Exchange</small>
                            <br />
                            {exchangeBalances && exchangeBalances[0]}
                        </p>
                    </div>

                    <form
                        onSubmit={
                            isDeposit
                                ? (e) => depositHandler(e, tokens[0])
                                : (e) => withdrawHandler(e, tokens[0])
                        }
                    >
                        <label htmlFor="token0">
                            {symbols && symbols[0]} Amount
                        </label>
                        <input
                            type="text"
                            id="token0"
                            placeholder="0.0000"
                            value={
                                token1TransferAmount === 0
                                    ? ""
                                    : token1TransferAmount
                            }
                            onChange={(e) => amountHandler(e, tokens[0])}
                        />

                        <button className="button" type="submit">
                            {isDeposit ? (
                                <span>Deposit</span>
                            ) : (
                                <span>Withdraw</span>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                ""
            )}

            <hr />
            {/* Deposit/Withdraw Component 2 (mETH) */}
            {/* Rendering conditions*/}

            {isSecondTokenNFZ ? (
                <div>
                    <div className="exchange__transfers--form">
                        <div className="flex-between">
                            <p>
                                <small>Token</small>
                                <br />
                                <img
                                    src={nfz_logo}
                                    alt="Nefza Token Logo"
                                    className="token_logo"
                                />
                                {symbols && symbols[1]}
                            </p>
                            <p>
                                <small>Wallet</small>
                                <br />
                                {tokenBalances && tokenBalances[1]}
                            </p>
                            <p>
                                <small>Exchange</small>
                                <br />
                                {exchangeBalances && exchangeBalances[1]}
                            </p>
                        </div>

                        <form
                            onSubmit={
                                isDeposit
                                    ? (e) => depositHandler(e, tokens[1])
                                    : (e) => withdrawHandler(e, tokens[1])
                            }
                        >
                            <label htmlFor="token1">
                                {symbols && symbols[1]} Amount
                            </label>
                            <input
                                type="text"
                                id="token1"
                                placeholder="0.0000"
                                value={
                                    token2TransferAmount === 0
                                        ? ""
                                        : token2TransferAmount
                                }
                                onChange={(e) => amountHandler(e, tokens[1])}
                            />

                            <button className="button" type="submit">
                                {isDeposit ? (
                                    <span>Deposit</span>
                                ) : (
                                    <span>Withdraw</span>
                                )}
                            </button>
                        </form>
                    </div>

                    <hr />
                </div>
            ) : (
                ""
            )}

            {isSecondTokenmETH ? (
                <div>
                    <div className="exchange__transfers--form">
                        <div className="flex-between">
                            <p>
                                <small>Token</small>
                                <br />
                                <img
                                    src={eth_logo}
                                    alt="mETH Token Logo"
                                    className="token_logo"
                                />
                                {symbols && symbols[1]}
                            </p>
                            <p>
                                <small>Wallet</small>
                                <br />
                                {tokenBalances && tokenBalances[1]}
                            </p>
                            <p>
                                <small>Exchange</small>
                                <br />
                                {exchangeBalances && exchangeBalances[1]}
                            </p>
                        </div>

                        <form
                            onSubmit={
                                isDeposit
                                    ? (e) => depositHandler(e, tokens[1])
                                    : (e) => withdrawHandler(e, tokens[1])
                            }
                        >
                            <label htmlFor="token1">
                                {symbols && symbols[1]} Amount
                            </label>
                            <input
                                type="text"
                                id="token1"
                                placeholder="0.0000"
                                value={
                                    token2TransferAmount === 0
                                        ? ""
                                        : token2TransferAmount
                                }
                                onChange={(e) => amountHandler(e, tokens[1])}
                            />

                            <button className="button" type="submit">
                                {isDeposit ? (
                                    <span>Deposit</span>
                                ) : (
                                    <span>Withdraw</span>
                                )}
                            </button>
                        </form>
                    </div>

                    <hr />
                </div>
            ) : (
                ""
            )}

            {isSecondTokenmDAI ? (
                <div>
                    <div className="exchange__transfers--form">
                        <div className="flex-between">
                            <p>
                                <small>Token</small>
                                <br />
                                <img
                                    src={mDAI_logo}
                                    alt="mDAI Token Logo"
                                    className="token_logo"
                                />
                                {symbols && symbols[1]}
                            </p>
                            <p>
                                <small>Wallet</small>
                                <br />
                                {tokenBalances && tokenBalances[1]}
                            </p>
                            <p>
                                <small>Exchange</small>
                                <br />
                                {exchangeBalances && exchangeBalances[1]}
                            </p>
                        </div>

                        <form
                            onSubmit={
                                isDeposit
                                    ? (e) => depositHandler(e, tokens[1])
                                    : (e) => withdrawHandler(e, tokens[1])
                            }
                        >
                            <label htmlFor="token1">
                                {symbols && symbols[1]} Amount
                            </label>
                            <input
                                type="text"
                                id="token1"
                                placeholder="0.0000"
                                value={
                                    token2TransferAmount === 0
                                        ? ""
                                        : token2TransferAmount
                                }
                                onChange={(e) => amountHandler(e, tokens[1])}
                            />

                            <button className="button" type="submit">
                                {isDeposit ? (
                                    <span>Deposit</span>
                                ) : (
                                    <span>Withdraw</span>
                                )}
                            </button>
                        </form>
                    </div>

                    <hr />
                </div>
            ) : (
                ""
            )}
        </div>
    )
}

export default Balance
