# FFC Fleet Audit Report

> **Point-in-time snapshot** generated on 2026-07-12.
> Re-run with `node scripts/fleet-audit.mjs` or the **Fleet Audit** workflow
> (`.github/workflows/fleet-audit.yml`, workflow_dispatch). The fleet is every
> live charity site in `docs/sites_list.csv` (Site Health = Live, still with
> FFC, not staging, not for-profit).

## Summary

- **Sites audited:** 85
- **Reachable:** 84 / 85
- **Down / broken:** 1
- **Footer-standard compliant:** 0 / 84 reachable sites
- Individual checks (of 84 reachable): FFC marker 23, FFC link 17, hub link 2, EIN 15, "Supported by" 7

## Down or broken sites (action needed)

| Charity             | Problem                                                               |
| ------------------- | --------------------------------------------------------------------- |
| sporting2impact.org | unreachable: tls-error (ERR_SSL_PACKET_LENGTH_TOO_LONG); needed retry |

## Section A — FFC footer-standard compliance

| Charity                                   | Status | HTTPS | Footer marker | Supported by | EIN | Hub link | Notes                                                                 |
| ----------------------------------------- | ------ | ----- | ------------- | ------------ | --- | -------- | --------------------------------------------------------------------- |
| aariasblueelephant.org                    | 200    | yes   | no            | no           | yes | no       | missing: FFC marker, FFC link, hub link, "Supported by"               |
| amargraves.org                            | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| ambofoundation.org                        | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| avengedfastpitch.org                      | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| bearupinternationalministries.org         | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| bintobetter.org                           | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| bowiesblessings.org                       | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| browncanyonranch.org                      | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| canadatokeywestcoastalrun.org             | 200    | yes   | yes           | no           | no  | no       | missing: hub link, EIN, "Supported by"                                |
| clarasbridge.org                          | 200    | yes   | yes           | no           | yes | yes      | missing: "Supported by"                                               |
| compassionstl.org                         | 200    | yes   | yes           | no           | no  | no       | missing: hub link, EIN, "Supported by"                                |
| coronadonationalforestheritagesociety.org | 200    | yes   | yes           | no           | yes | no       | missing: hub link, "Supported by"                                     |
| craftedraise.org                          | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| ctvip.org                                 | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| cucu-il.org                               | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| cvrs-us.org                               | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| database.onlineimpacts.org                | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| dropletsoflove.org                        | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| educationandempowerment.org               | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| empowerconnectfoundation.org              | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| exceptionalridersprogram.org              | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| facinggiantsnc.org                        | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| falloutshelterecovillage.org              | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| fencingtogether.org                       | 200    | yes   | no            | no           | yes | no       | missing: FFC marker, FFC link, hub link, "Supported by"               |
| ffcadmin.org                              | 200    | yes   | yes           | no           | yes | no       | missing: hub link, "Supported by"                                     |
| ffctools.onlineimpacts.org                | 200    | yes   | yes           | no           | no  | no       | missing: hub link, EIN, "Supported by"                                |
| ffcworkingsite2.org                       | 200    | yes   | yes           | no           | yes | yes      | missing: "Supported by"                                               |
| freedomrisingusa.org                      | 200    | yes   | yes           | no           | no  | no       | missing: FFC link, hub link, EIN, "Supported by"                      |
| garrisonareacaregivers.org                | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| graftonareahistory.org                    | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| greenrecon.org                            | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| harmonycenterfoundation.org               | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| hclwellness.org                           | 200    | yes   | yes           | no           | no  | no       | missing: FFC link, hub link, EIN, "Supported by"                      |
| heroes2others.org                         | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| homesforchange.org                        | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| jwvpost619.org                            | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| kainkaryasri.org                          | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| kierstensride.org                         | 200    | yes   | no            | yes          | no  | no       | missing: FFC marker, FFC link, hub link, EIN                          |
| kittencoveinc.org                         | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| ksgf.org                                  | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| legioninthewoods.org                      | 200    | yes   | yes           | no           | no  | no       | missing: FFC link, hub link, EIN, "Supported by"                      |
| letsdanceactivities.org                   | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| letsleadwise.org                          | 200    | yes   | no            | no           | yes | no       | missing: FFC marker, FFC link, hub link, "Supported by"               |
| letspiritlead.org                         | 200    | yes   | yes           | yes          | no  | no       | missing: hub link, EIN                                                |
| lifelessonslearned.us.org                 | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| lovemustwin.org                           | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| makeacalendarinvite.org                   | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| mitchellnchistory.org                     | 200    | yes   | yes           | no           | no  | no       | missing: hub link, EIN, "Supported by"                                |
| my-missions.org                           | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| myservicehours.org                        | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| nittanypost245.org                        | 200    | yes   | yes           | no           | no  | no       | missing: FFC link, hub link, EIN, "Supported by"                      |
| nj4israel.org                             | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| nochaos.org                               | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| nolef.onlineimpacts.org                   | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| nottinghampc.org                          | 200    | yes   | no            | yes          | no  | no       | missing: FFC marker, FFC link, hub link, EIN                          |
| onlineimpacts.org                         | 200    | yes   | no            | yes          | no  | no       | missing: FFC marker, FFC link, hub link, EIN                          |
| operationhomesforheroes.org               | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| pagbooster.org                            | 200    | yes   | yes           | yes          | yes | no       | missing: hub link                                                     |
| pfplus.org                                | 200    | yes   | no            | no           | yes | no       | missing: FFC marker, FFC link, hub link, "Supported by"               |
| phoenixartsandadvocacy.org                | 200    | yes   | yes           | no           | yes | no       | missing: hub link, "Supported by"                                     |
| ptuganda.org                              | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| rebirthsdc.org                            | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| restoredradiancefoundation.org            | 200    | yes   | yes           | no           | yes | no       | missing: hub link, "Supported by"                                     |
| savewatersaveplanet.org                   | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| slopestohope.org                          | 200    | yes   | yes           | no           | no  | no       | missing: FFC link, hub link, EIN, "Supported by"                      |
| southamptonfriends.org                    | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| sporting2impact.org                       | DOWN   | no    | —             | —            | —   | —        | unreachable: tls-error (ERR_SSL_PACKET_LENGTH_TOO_LONG); needed retry |
| tamkeensports.org                         | 200    | yes   | no            | no           | yes | no       | missing: FFC marker, FFC link, hub link, "Supported by"               |
| tasteandseelocal.org                      | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| technologyadoptionbarriers.org            | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| technologymonastery.org                   | 200    | yes   | yes           | yes          | no  | no       | missing: FFC link, hub link, EIN                                      |
| theafghanistanaffairs.org                 | 200    | yes   | yes           | no           | yes | no       | missing: hub link, "Supported by"                                     |
| thebirf.org                               | 200    | yes   | no            | no           | yes | no       | missing: FFC marker, FFC link, hub link, "Supported by"               |
| thedeviators.org                          | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| theeverythingproject.org                  | 200    | yes   | yes           | no           | no  | no       | missing: hub link, EIN, "Supported by"                                |
| thegracehouseinc.org                      | 200    | yes   | no            | yes          | no  | no       | missing: FFC marker, FFC link, hub link, EIN                          |
| thekccf.org                               | 200    | yes   | no            | no           | yes | no       | missing: FFC marker, FFC link, hub link, "Supported by"               |
| thestudiovisit.org                        | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| thewayofyeshuaministries.org              | 200    | yes   | yes           | no           | no  | no       | missing: hub link, EIN, "Supported by"                                |
| transferca.org                            | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| turksotx.org                              | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| veterans.onlineimpacts.org                | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| wamhelp.org                               | 200    | yes   | yes           | no           | no  | no       | missing: hub link, EIN, "Supported by"                                |
| www.wonderseedstudios.org                 | 200    | yes   | yes           | no           | no  | no       | missing: hub link, EIN, "Supported by"                                |
| youngfatherscare.org                      | 200    | yes   | no            | no           | no  | no       | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |

## Section B — Site health

| Charity                                   | HTTP status | HTTPS | Final URL                                          | Redirect hops | Notes                                                                 |
| ----------------------------------------- | ----------- | ----- | -------------------------------------------------- | ------------- | --------------------------------------------------------------------- |
| aariasblueelephant.org                    | 200         | yes   | https://aariasblueelephant.org/                    | 0             | missing: FFC marker, FFC link, hub link, "Supported by"               |
| amargraves.org                            | 200         | yes   | https://amargraves.org/                            | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| ambofoundation.org                        | 200         | yes   | https://ambofoundation.org/                        | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| avengedfastpitch.org                      | 200         | yes   | https://avengedfastpitch.org/                      | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| bearupinternationalministries.org         | 200         | yes   | https://bearupinternationalministries.org/         | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| bintobetter.org                           | 200         | yes   | https://bintobetter.org/                           | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| bowiesblessings.org                       | 200         | yes   | https://bowiesblessings.org/                       | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| browncanyonranch.org                      | 200         | yes   | https://browncanyonranch.org/                      | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| canadatokeywestcoastalrun.org             | 200         | yes   | https://canadatokeywestcoastalrun.org/             | 0             | missing: hub link, EIN, "Supported by"                                |
| clarasbridge.org                          | 200         | yes   | https://clarasbridge.org/                          | 0             | missing: "Supported by"                                               |
| compassionstl.org                         | 200         | yes   | https://compassionstl.org/                         | 0             | missing: hub link, EIN, "Supported by"                                |
| coronadonationalforestheritagesociety.org | 200         | yes   | https://coronadonationalforestheritagesociety.org/ | 0             | missing: hub link, "Supported by"                                     |
| craftedraise.org                          | 200         | yes   | https://craftedraise.org/                          | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| ctvip.org                                 | 200         | yes   | https://ctvip.org/                                 | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| cucu-il.org                               | 200         | yes   | https://cucu-il.org/                               | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| cvrs-us.org                               | 200         | yes   | https://cvrs-us.org/                               | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| database.onlineimpacts.org                | 200         | yes   | https://database.onlineimpacts.org/                | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| dropletsoflove.org                        | 200         | yes   | https://dropletsoflove.org/                        | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| educationandempowerment.org               | 200         | yes   | https://educationandempowerment.org/               | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| empowerconnectfoundation.org              | 200         | yes   | https://empowerconnectfoundation.org/              | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| exceptionalridersprogram.org              | 200         | yes   | https://exceptionalridersprogram.org/              | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| facinggiantsnc.org                        | 200         | yes   | https://facinggiantsnc.org/                        | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| falloutshelterecovillage.org              | 200         | yes   | https://falloutshelterecovillage.org/              | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| fencingtogether.org                       | 200         | yes   | https://fencingtogether.org/                       | 0             | missing: FFC marker, FFC link, hub link, "Supported by"               |
| ffcadmin.org                              | 200         | yes   | https://ffcadmin.org/                              | 0             | missing: hub link, "Supported by"                                     |
| ffctools.onlineimpacts.org                | 200         | yes   | https://ffctools.onlineimpacts.org/                | 0             | missing: hub link, EIN, "Supported by"                                |
| ffcworkingsite2.org                       | 200         | yes   | https://ffcworkingsite2.org/                       | 0             | missing: "Supported by"                                               |
| freedomrisingusa.org                      | 200         | yes   | https://freedomrisingusa.org/                      | 0             | missing: FFC link, hub link, EIN, "Supported by"                      |
| garrisonareacaregivers.org                | 200         | yes   | https://garrisonareacaregivers.org/                | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| graftonareahistory.org                    | 200         | yes   | https://graftonareahistory.org/                    | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| greenrecon.org                            | 200         | yes   | https://greenrecon.org/                            | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| harmonycenterfoundation.org               | 200         | yes   | https://harmonycenterfoundation.org/               | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| hclwellness.org                           | 200         | yes   | https://hclwellness.org/                           | 0             | missing: FFC link, hub link, EIN, "Supported by"                      |
| heroes2others.org                         | 200         | yes   | https://heroes2others.org/                         | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| homesforchange.org                        | 200         | yes   | https://homesforchange.org/                        | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| jwvpost619.org                            | 200         | yes   | https://jwvpost619.org/                            | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| kainkaryasri.org                          | 200         | yes   | https://kainkaryasri.org/                          | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| kierstensride.org                         | 200         | yes   | https://kierstensride.org/                         | 0             | missing: FFC marker, FFC link, hub link, EIN                          |
| kittencoveinc.org                         | 200         | yes   | https://kittencoveinc.org/                         | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| ksgf.org                                  | 200         | yes   | https://ksgf.org/                                  | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| legioninthewoods.org                      | 200         | yes   | https://legioninthewoods.org/                      | 0             | missing: FFC link, hub link, EIN, "Supported by"                      |
| letsdanceactivities.org                   | 200         | yes   | https://letsdanceactivities.org/                   | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| letsleadwise.org                          | 200         | yes   | https://letsleadwise.org/                          | 0             | missing: FFC marker, FFC link, hub link, "Supported by"               |
| letspiritlead.org                         | 200         | yes   | https://letspiritlead.org/                         | 0             | missing: hub link, EIN                                                |
| lifelessonslearned.us.org                 | 200         | yes   | https://lifelessonslearned.us.org/                 | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| lovemustwin.org                           | 200         | yes   | https://lovemustwin.org/                           | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| makeacalendarinvite.org                   | 200         | yes   | https://makeacalendarinvite.org/                   | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| mitchellnchistory.org                     | 200         | yes   | https://mitchellnchistory.org/                     | 0             | missing: hub link, EIN, "Supported by"                                |
| my-missions.org                           | 200         | yes   | https://my-missions.org/                           | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| myservicehours.org                        | 200         | yes   | https://myservicehours.org/                        | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| nittanypost245.org                        | 200         | yes   | https://nittanypost245.org/                        | 0             | missing: FFC link, hub link, EIN, "Supported by"                      |
| nj4israel.org                             | 200         | yes   | https://nj4israel.org/                             | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| nochaos.org                               | 200         | yes   | https://nochaos.org/                               | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| nolef.onlineimpacts.org                   | 200         | yes   | https://nolef.onlineimpacts.org/                   | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| nottinghampc.org                          | 200         | yes   | https://nottinghampc.org/                          | 0             | missing: FFC marker, FFC link, hub link, EIN                          |
| onlineimpacts.org                         | 200         | yes   | https://onlineimpacts.org/                         | 0             | missing: FFC marker, FFC link, hub link, EIN                          |
| operationhomesforheroes.org               | 200         | yes   | https://operationhomesforheroes.org/               | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| pagbooster.org                            | 200         | yes   | https://pagbooster.org/                            | 0             | missing: hub link                                                     |
| pfplus.org                                | 200         | yes   | https://pfplus.org/                                | 0             | missing: FFC marker, FFC link, hub link, "Supported by"               |
| phoenixartsandadvocacy.org                | 200         | yes   | https://phoenixartsandadvocacy.org/                | 0             | missing: hub link, "Supported by"                                     |
| ptuganda.org                              | 200         | yes   | https://ptuganda.org/                              | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| rebirthsdc.org                            | 200         | yes   | https://rebirthsdc.org/                            | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| restoredradiancefoundation.org            | 200         | yes   | https://restoredradiancefoundation.org/            | 0             | missing: hub link, "Supported by"                                     |
| savewatersaveplanet.org                   | 200         | yes   | https://savewatersaveplanet.org/                   | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| slopestohope.org                          | 200         | yes   | https://slopestohope.org/                          | 0             | missing: FFC link, hub link, EIN, "Supported by"                      |
| southamptonfriends.org                    | 200         | yes   | https://southamptonfriends.org/                    | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| sporting2impact.org                       | DOWN        | no    | —                                                  | 0             | unreachable: tls-error (ERR_SSL_PACKET_LENGTH_TOO_LONG); needed retry |
| tamkeensports.org                         | 200         | yes   | https://tamkeensports.org/                         | 0             | missing: FFC marker, FFC link, hub link, "Supported by"               |
| tasteandseelocal.org                      | 200         | yes   | https://tasteandseelocal.org/                      | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| technologyadoptionbarriers.org            | 200         | yes   | https://technologyadoptionbarriers.org/            | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| technologymonastery.org                   | 200         | yes   | https://technologymonastery.org/                   | 0             | missing: FFC link, hub link, EIN                                      |
| theafghanistanaffairs.org                 | 200         | yes   | https://theafghanistanaffairs.org/                 | 0             | missing: hub link, "Supported by"                                     |
| thebirf.org                               | 200         | yes   | https://thebirf.org/                               | 0             | missing: FFC marker, FFC link, hub link, "Supported by"               |
| thedeviators.org                          | 200         | yes   | https://thedeviators.org/                          | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| theeverythingproject.org                  | 200         | yes   | https://theeverythingproject.org/                  | 0             | missing: hub link, EIN, "Supported by"                                |
| thegracehouseinc.org                      | 200         | yes   | https://thegracehouseinc.org/                      | 0             | missing: FFC marker, FFC link, hub link, EIN                          |
| thekccf.org                               | 200         | yes   | https://thekccf.org/                               | 0             | missing: FFC marker, FFC link, hub link, "Supported by"               |
| thestudiovisit.org                        | 200         | yes   | https://thestudiovisit.org/                        | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| thewayofyeshuaministries.org              | 200         | yes   | https://thewayofyeshuaministries.org/              | 0             | missing: hub link, EIN, "Supported by"                                |
| transferca.org                            | 200         | yes   | https://transferca.org/                            | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| turksotx.org                              | 200         | yes   | https://turksotx.org/                              | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| veterans.onlineimpacts.org                | 200         | yes   | https://veterans.onlineimpacts.org/                | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
| wamhelp.org                               | 200         | yes   | https://wamhelp.org/                               | 0             | missing: hub link, EIN, "Supported by"                                |
| www.wonderseedstudios.org                 | 200         | yes   | https://www.wonderseedstudios.org/                 | 0             | missing: hub link, EIN, "Supported by"                                |
| youngfatherscare.org                      | 200         | yes   | https://youngfatherscare.org/                      | 0             | missing: FFC marker, FFC link, hub link, EIN, "Supported by"          |
