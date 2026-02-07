import SpotlightCard from "./CardAnimation/SpotlightCard";
import FallingImagesBackground from './FallingImagesBackground'

import aiSvg from '../assets/ai.svg'
import alienSvg from '../assets/alien.svg'
import arroeSvg from '../assets/arroe.svg'
import chipSvg from '../assets/chip.svg'
import cloudSvg from '../assets/cloud.svg'
import dataSvg from '../assets/data.svg'
import gearSvg from '../assets/gear.svg'
import mlSvg from '../assets/ml.svg'
import palySvg from '../assets/paly.svg'
import starSvg from '../assets/star.svg'
import dollarSvg from '../assets/dollar.svg'
import gear1Svg from '../assets/gear1.svg'
import gitSvg from '../assets/git.svg'
import monitorSvg from '../assets/monitor.svg'
import toolsSvg from '../assets/tools.svg'

export default function AboutCard() {
    return (
        <SpotlightCard className="w-full min-h-[140vh] sm:min-h-[110vh] md:min-h-[100vh] lg:min-h-0 lg:h-full" bgColor="#E3F2FD">
            <FallingImagesBackground
                images={[aiSvg,alienSvg, arroeSvg,chipSvg,cloudSvg,dataSvg,gearSvg,mlSvg,palySvg,starSvg,gear1Svg,gitSvg,dollarSvg,monitorSvg,toolsSvg]}
                imageWidth={150}
                imageHeight={150}
                gravity={0.4}
                bounce={0.5}
                rotation={true}
                backgroundColor="transparent"
                trigger="scroll"
                bottomDepth={90}
                hoverForce={8}
            >
                <div className="w-full h-full flex flex-col">
                    
                    <div className="self-start max-w-3xl mb-auto">
                        <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[1] uppercase text-gray-900">
                            Do Crazy Things That Matter.
                        </h1>
                    </div>

                    <div className="self-end max-w-xs sm:max-w-sm md:max-w-md mt-[25vh] sm:mt-[15vh] md:mt-[10vh] lg:mt-auto">
                        <h2 className="text-base md:text-xl lg:text-2xl font-black tracking-[4px] md:tracking-[5px] text-gray-900 uppercase mb-8 md:mb-10 lg:mb-12 text-right">
                            About GDG
                        </h2>
                        <p className="text-sm md:text-base lg:text-lg leading-loose md:leading-loose lg:leading-loose text-gray-700 text-justify font-bold">
                            Google Developer Group on Campus are university-based community groups for students interested in Google developer technologies. Students from all undergraduate or graduate programs with an interest in growing as a developer are welcome.
                        </p>
                    </div>

                    <div className="h-[40vh] sm:h-[30vh] md:h-[25vh] lg:h-0"></div>
                </div>
            </FallingImagesBackground>
        </SpotlightCard>
    );
}